import { toDuration, toDurationString } from './unit';

describe('utils/unit', () => {
  it('should convert milliseconds to duration structure', () => {
    const fiveDays = 5 * 24 * 60 * 60 * 1000;
    const twoHours = 2 * 60 * 60 * 1000;
    const fourtyFiveMinutes = 45 * 60 * 1000;
    const thirtythreeSeconds = 33 * 1000;
    const fiveThousandMilliseconds = 500;

    expect(
      toDuration(
        fiveDays + twoHours + fourtyFiveMinutes + thirtythreeSeconds + fiveThousandMilliseconds
      )
    ).toStrictEqual({
      days: 5,
      hours: 2,
      minutes: 45,
      seconds: 33,
      milliseconds: 500,
    });
  });

  it('should convert duration structure in duration string', () => {
    const t = (lbl: string, plural: boolean) => {
      if (lbl === 'hours') {
        return plural ? 'hours' : 'hour';
      }
      return lbl;
    };

    expect(
      toDurationString(t, {
        days: 5,
        hours: 2,
        minutes: 45,
        seconds: 33,
        milliseconds: 500,
      })
    ).toStrictEqual('5 days and 2 hours');

    expect(
      toDurationString(t, {
        days: 5,
        hours: 0,
        minutes: 45,
        seconds: 33,
        milliseconds: 500,
      })
    ).toStrictEqual('5 days');

    expect(
      toDurationString(t, {
        days: 0,
        hours: 2,
        minutes: 45,
        seconds: 33,
        milliseconds: 500,
      })
    ).toStrictEqual('2 hours');

    expect(
      toDurationString(t, {
        days: 0,
        hours: 0,
        minutes: 45,
        seconds: 33,
        milliseconds: 500,
      })
    ).toStrictEqual('less than one hour');

    expect(
      toDurationString(t, {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    ).toStrictEqual('expired');

    expect(
      toDurationString(t, {
        days: -1,
        hours: -3,
        minutes: -1,
        seconds: -5,
        milliseconds: -100,
      })
    ).toStrictEqual('expired');

    expect(
      toDurationString(t, {
        days: 0,
        hours: 1,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    ).toStrictEqual('1 hour');
  });
});
