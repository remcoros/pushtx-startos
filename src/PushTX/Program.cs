/*

A simple proxy to expose a pushtx (mempool.space) compatible api that uses bitcoin rpc methods sendrawtransaction and getrawtransaction.

Serves a custom version of Coldcard's pushtx single html file that only uses this proxy to publish a transaction.

Links:

- pushtx spec: https://pushtx.org / https://github.com/Coldcard/firmware/blob/master/docs/nfc-pushtx.md
- pushtx impl: https://github.com/Coldcard/push-tx/blob/master/cc-implementation/src/main.ts
- pushtx in mempool: https://github.com/mempool/mempool/pull/5132
- getrawtransaction: https://developer.bitcoin.org/reference/rpc/getrawtransaction.html

*/

using System.Net.Http.Headers;
using System.Text.Json.Nodes;

/*
 * Build WebApplication
 */
var builder = WebApplication.CreateSlimBuilder(args);

// only use a simple console logger
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole(x =>
{
    x.SingleLine = true;
});
builder.Services.AddSingleton(sp => sp.GetRequiredService<ILoggerFactory>().CreateLogger("PushTX"));

// simple json-rpc client
builder.Services.AddHttpClient<RpcClient>();

// this will throw when RPC_HOST / RPC_USERNAME / RPC_PASSWORD are not set
var rpcSettings = RpcSettings.FromEnvironmentVariables(args);
builder.Services.AddSingleton(rpcSettings);

var app = builder.Build();

/*
 * Endpoints
 */

// for static index.html file
app.UseDefaultFiles();
app.UseStaticFiles();

// POST api/tx
// returns: a transaction id (string)
app.MapPost("/api/tx", async (
    HttpContext context,
    [FromServices] ILogger log,
    [FromServices] RpcClient rpcClient,
    [FromServices] RpcSettings settings) =>
{
    using var rdr = new StreamReader(context.Request.Body);
    var transactionHex = await rdr.ReadToEndAsync();
    if (string.IsNullOrEmpty(transactionHex))
    {
        return Results.BadRequest("Transaction hex is required");
    }

    try
    {
        var sendRawTx = new RpcRequest<string>
        {
            Id = "pushtx-send",
            Method = "sendrawtransaction",
            Params = [transactionHex]
        };

        var txId = await rpcClient.Send(sendRawTx);
        if (string.IsNullOrEmpty(txId))
        {
            var error = "empty response from bitcoin rpc api";
            return Results.Content(error, statusCode: StatusCodes.Status500InternalServerError);
        }

        return Results.Ok(txId);
    }
    catch (Exception ex)
    {
        log.LogError(ex, "failed to send transaction: {Message}", ex.Message);
        return Results.Content(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
});

// GET api/tx/{txid}
// returns: mempool.space compatible transaction result (json)
app.MapGet("/api/tx/{txid}", async (
    HttpContext context,
    [FromServices] ILogger log,
    [FromServices] RpcClient rpcClient,
    [FromServices] RpcSettings settings,
    [FromRoute] string txid) =>
{
    if (string.IsNullOrEmpty(txid))
    {
        return Results.BadRequest("transaction id is required");
    }

    try
    {
        var getRawTx = new RpcRequest<JsonObject>
        {
            Id = "pushtx-get",
            Method = "getrawtransaction",
            Params = [txid, true]
        };

        var rpcResult = await rpcClient.Send(getRawTx);
        if (rpcResult is null)
        {
            var error = "empty response from bitcoin rpc api";
            return Results.Content(error, statusCode: StatusCodes.Status500InternalServerError);
        }

        // query tx data for all inputs to get address and value
        var vins = rpcResult["vin"]?.AsArray() ?? [];

        // get previous output data of all inputs in paralell
        await Parallel.ForEachAsync(vins.OfType<JsonObject>(), async (vin, token) =>
        {
            var vinTxid = (string)vin["txid"]!;
            var vout = (int)vin["vout"]!;

            if (string.IsNullOrEmpty(vinTxid) || vout < 0)
            {
                return;
            }

            var getVinTx = new RpcRequest<JsonObject>
            {
                Id = "pushtx-get",
                Method = "getrawtransaction",
                Params = [vinTxid, true]
            };
            var vinResult = await rpcClient.Send(getVinTx);

            if (vinResult is not null)
            {
                // add 'prevout' properties to match mempool.space api
                vin["prevout"] = vinResult["vout"]![vout]!.DeepClone();
            }
        });

        // map BTC Core result to mempool.space api result
        // map inputs
        var mempoolVin = rpcResult["vin"]!.AsArray().OfType<JsonObject>()
            .Select(vin =>
            {
                var prevout = new MempoolTxDataVout(
                        (string)vin["prevout"]!["scriptPubKey"]!["hex"]!,
                        (string)vin["prevout"]!["scriptPubKey"]!["address"]!,
                        (int)((decimal)vin["prevout"]!["value"]! * 1e8m));
                return new MempoolTxDataVin((string)vin["txid"]!, (int)vin["vout"]!, prevout);
            })
            .ToArray();

        // map outputs
        var mempoolVout = rpcResult["vout"]!.AsArray().OfType<JsonObject>()
            .Select(vout =>
                new MempoolTxDataVout(
                    (string)vout["scriptPubKey"]!["hex"]!,
                    (string)vout["scriptPubKey"]!["address"]!,
                    (int)((decimal)vout["value"]! * 1e8m)))
            .ToArray();

        // if we have a blockhash, transaction is confirmed and we can query for the block info to get height
        var blockHeight = 0;
        var blockHash = rpcResult["blockhash"]?.GetValue<string>();
        if (!string.IsNullOrEmpty(blockHash))
        {
            var getBlock = new RpcRequest<JsonObject>
            {
                Id = "pushtx-getblock",
                Method = "getblock",
                Params = [blockHash, 1]
            };
            var blockResult = await rpcClient.Send(getBlock);
            blockHeight = blockResult?["height"]?.GetValue<int>() ?? 0;
        }

        // final mempool.space api compatible result
        var result = new MempoolTxData(
            txid, mempoolVin, mempoolVout,
            new MempoolConfirmedStatus(
                blockHeight > 0,
                blockHeight));
        return Results.Json(result);
    }
    catch (Exception ex)
    {
        log.LogError(ex, "failed to get transaction data: {Message}", ex.Message);
        return Results.Content(ex.Message, statusCode: StatusCodes.Status500InternalServerError);
    }
});

/*
 * Run it!
 */
var log = app.Services.GetRequiredService<ILogger>();

app.Services.GetRequiredService<IHostApplicationLifetime>()
    .ApplicationStarted.Register(() => log.LogInformation("Application started."));

app.Run();

/*
 * json-rpc 2.0 client and request/response types
 */
public class RpcClient
{
    private readonly HttpClient _client;
    private readonly RpcSettings _settings;

    public RpcClient(HttpClient client, RpcSettings settings)
    {
        _client = client;
        _settings = settings;
    }

    public Task Send(RpcRequest request)
    {
        return Send<object?>(request);
    }

    public async Task<TResult?> Send<TResult>(RpcRequest<TResult> request)
    {
        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, _settings.Host)
        {
            Content = JsonContent.Create(request),
            Headers = { Authorization = _settings.GetOrCreateBasicAuthHeader() }
        };

        // send request
        using var response = await _client.SendAsync(httpRequest);
        response.EnsureSuccessStatusCode();

        var rpcResponse = await response.Content.ReadFromJsonAsync<RpcResponse<TResult>>();
        if (rpcResponse is null || rpcResponse?.Error is not null)
        {
            var rpcError = rpcResponse?.Error?.Message ?? "Unknown";
            throw new HttpRequestException(rpcError, null, System.Net.HttpStatusCode.InternalServerError);
        }

        var result = rpcResponse!.Result;
        return result;
    }
}

public class RpcRequest<TResult>
{
    [JsonPropertyName("jsonrpc")]
    public string JsonRpc { get; set; } = "2.0";

    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("method")]
    public string Method { get; set; } = string.Empty;

    [JsonPropertyName("params")]
    public object[] Params { get; set; } = [];
}

public class RpcRequest : RpcRequest<object?> { }

public class RpcResponse<TResult>
{
    [JsonPropertyName("jsonrpc")]
    public string JsonRpc { get; set; } = "2.0";

    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("result")]
    public TResult? Result { get; set; }

    [JsonPropertyName("error")]
    public RpcError? Error { get; set; }
}

public class RpcError
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public object? Data { get; set; }
}

public class RpcSettings
{
    private AuthenticationHeaderValue? _authHeader;

    public string Host { get; }
    public string Username { get; }
    public string Password { get; }

    public RpcSettings(string host, string username, string password)
    {
        ArgumentException.ThrowIfNullOrEmpty(host, nameof(host));
        ArgumentException.ThrowIfNullOrEmpty(username, nameof(username));
        ArgumentException.ThrowIfNullOrEmpty(password, nameof(password));

        Host = host;
        Username = username;
        Password = password;
    }

    public AuthenticationHeaderValue GetOrCreateBasicAuthHeader()
    {
        return _authHeader ??= CreateBasicAuthHeader();
    }

    private AuthenticationHeaderValue CreateBasicAuthHeader()
    {
        var authHeaderValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{Username}:{Password}"));
        return new AuthenticationHeaderValue("Basic", authHeaderValue);
    }

    public static RpcSettings FromEnvironmentVariables(string[] args)
    {
        // get variable or throw if empty
        string EnvVar(string name)
        {
            // try get from command line
            var arg = args.FirstOrDefault(x => x.StartsWith($"{name}=", StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(arg))
            {
                var parts = arg.Split('=');
                if (parts.Length == 2 && !string.IsNullOrEmpty(parts[1]))
                {
                    return parts[1];
                }
            }

            // get from env vars
            var value = Environment.GetEnvironmentVariable(name);
            if (string.IsNullOrEmpty(value))
            {
                throw new InvalidOperationException($"{name} environment variable not set");
            }

            return value;
        }

        return new RpcSettings(EnvVar("RPC_HOST"), EnvVar("RPC_USERNAME"), EnvVar("RPC_PASSWORD"));
    }
}

/*
 * mempool.space api like compatible models
 */
public class MempoolTxData(string txid, MempoolTxDataVin[] vin, MempoolTxDataVout[] vout, MempoolConfirmedStatus status)
{
    [JsonPropertyName("txid")]
    public string Txid { get; set; } = txid;

    [JsonPropertyName("fee")]
    public int Fee => Vin.Sum(x => x.Prevout.Value) - Vout.Sum(x => x.Value);

    [JsonPropertyName("status")]
    public MempoolConfirmedStatus Status { get; set; } = status;

    [JsonPropertyName("vin")]
    public MempoolTxDataVin[] Vin { get; set; } = vin;

    [JsonPropertyName("vout")]
    public MempoolTxDataVout[] Vout { get; set; } = vout;
}

public class MempoolTxDataVin(string txid, int vout, MempoolTxDataVout prevout)
{
    [JsonPropertyName("txid")]
    public string Txid { get; set; } = txid;

    [JsonPropertyName("vout")]
    public int Vout { get; set; } = vout;

    [JsonPropertyName("prevout")]
    public MempoolTxDataVout Prevout { get; set; } = prevout;
}

public class MempoolTxDataVout(string scriptPubkey, string scriptPubkeyAddress, int value)
{
    [JsonPropertyName("scriptpubkey")]
    public string ScriptPubkey { get; set; } = scriptPubkey;

    [JsonPropertyName("scriptpubkey_address")]
    public string ScriptPubkeyAddress { get; set; } = scriptPubkeyAddress;

    [JsonPropertyName("value")]
    public int Value { get; set; } = value;
}

public class MempoolConfirmedStatus(bool confirmed, int blockHeight)
{
    [JsonPropertyName("confirmed")]
    public bool Confirmed { get; set; } = confirmed;

    [JsonPropertyName("block_height")]
    public int BlockHeight { get; set; } = blockHeight;
}
