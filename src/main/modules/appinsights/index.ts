import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {
  enable(): void {
    if (config.get('appInsights.connectionString')) {
      appInsights
        .setup(config.get('appInsights.connectionString'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .start();

      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'cui-ra';
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
