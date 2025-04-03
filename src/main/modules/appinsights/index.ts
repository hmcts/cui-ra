import { Envelope } from 'applicationinsights/out/Declarations/Contracts';
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
        .setAutoCollectDependencies(false) // Disable dependency tracking
        .setAutoDependencyCorrelation(false) //  Disable automatic dependency correlation
        .start();

      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'cui-ra';
      appInsights.defaultClient.addTelemetryProcessor(
        (envelope: Envelope) => !envelope.data['baseData'].url?.includes('/health/')
      );
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
