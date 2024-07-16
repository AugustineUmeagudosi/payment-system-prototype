import { transferCatalyst } from './chimoneyCatalysts';

class CronJobSingleton {
  private static instance: CronJobSingleton;

  private constructor() {
    this.startCronJob();
  }

  public static getInstance(): CronJobSingleton {
    if (!CronJobSingleton.instance) CronJobSingleton.instance = new CronJobSingleton();
    return CronJobSingleton.instance;
  }

  private startCronJob() {
    console.log('[x] cron jobs initiated >>>>>>>>>>>>>>');

    const runCronJob = async () => {
      setInterval(transferCatalyst, 60000)
    };

    runCronJob();
  }
}

CronJobSingleton.getInstance();
