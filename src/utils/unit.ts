import { Fee } from '/models';

export const feePermillage = (f: Fee) => (f[1] / 100).toFixed(3);
export const dustToRev = (dust: number) => dust / 100000000;

const MILLISECONDS_IN_ONE_SECOND = 1000;
const MILLISECONDS_IN_ONE_MINUTE = 60 * MILLISECONDS_IN_ONE_SECOND;
const MILLISECONDS_IN_ONE_HOUR = 60 * MILLISECONDS_IN_ONE_MINUTE;
const MILLISECONDS_IN_ONE_DAY = 24 * MILLISECONDS_IN_ONE_HOUR;

export const toDuration = (milliseconds: number) => {
  const days = Math.trunc(milliseconds / MILLISECONDS_IN_ONE_DAY);
  const hours = Math.trunc((milliseconds - days * MILLISECONDS_IN_ONE_DAY) / MILLISECONDS_IN_ONE_HOUR);
  const minutes = Math.trunc(
    (milliseconds - (days * MILLISECONDS_IN_ONE_DAY + hours * MILLISECONDS_IN_ONE_HOUR)) / MILLISECONDS_IN_ONE_MINUTE
  );
  const seconds = Math.trunc(
    (milliseconds -
      (days * MILLISECONDS_IN_ONE_DAY + hours * MILLISECONDS_IN_ONE_HOUR + minutes * MILLISECONDS_IN_ONE_MINUTE)) /
      MILLISECONDS_IN_ONE_SECOND
  );
  const millisecs = Math.trunc(
    milliseconds -
      (days * MILLISECONDS_IN_ONE_DAY +
        hours * MILLISECONDS_IN_ONE_HOUR +
        minutes * MILLISECONDS_IN_ONE_MINUTE +
        seconds * MILLISECONDS_IN_ONE_SECOND)
  );

  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds: millisecs,
  };
};

export const isEmptyOrNegativeDuration = (duration: Duration) =>
  duration.days <= 0 &&
  duration.hours <= 0 &&
  duration.minutes <= 0 &&
  duration.seconds <= 0 &&
  duration.milliseconds <= 0;

type Duration = ReturnType<typeof toDuration>;
type TranslationFn = (lbl: string, plural: boolean) => string;

export const toDurationString = (translate: TranslationFn, duration: Duration) => {
  if (isEmptyOrNegativeDuration(duration)) return translate('expired', false);
  if (duration.days < 1 && duration.hours < 1) return translate('less than one hour', false);

  return [
    duration.days >= 1 ? `${duration.days} ${translate('days', duration.days > 1)}` : undefined,
    duration.hours >= 1 ? `${duration.hours} ${translate('hours', duration.hours > 1)}` : undefined,
  ]
    .filter((v) => v)
    .join(` ${translate('and', false)} `);
};
