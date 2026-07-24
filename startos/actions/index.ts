import { sdk } from '../sdk'
import { config } from './config'
import { showUrls } from './showUrls'

export const actions = sdk.Actions.of().addAction(config).addAction(showUrls)
