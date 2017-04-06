'use strict';

const {assert} = require('chai');
const moment = require('moment');
const {calcTotalInterestForBet} = require('../selectors');

// This may be overzealous constantness but my test descs & data got out-of-sync a couple times.
const DEC_01_2016 = '2016-12-01';
const DEC_15_2016 = '2016-12-15';
const JAN_15_2017 = '2017-01-15';
const FEB_28_2017 = '2017-02-28';

const TEN = 10;
const ZERO = 0;
const TWENTY_FIVE = 25;

const MOMENT_FORMAT = 'YYYY-MM-DD';

describe('selectors', () => {
  describe('calcTotalInterestPayments()', () => {
    const dec15th2016 = moment(DEC_15_2016, MOMENT_FORMAT);
    const bubbles = 100;
    const interest = .1;
    // Date format: YYYY-MM-DD
    describe(`when a 100 bubble bet was on ${DEC_15_2016} at 10%`, () => {
      describe(`when today is ${JAN_15_2017}`, () => {
        const jan15th2017 = moment(JAN_15_2017, MOMENT_FORMAT);
        it(`should return an interest value of ${TEN}`, () => {
          assert.strictEqual(
            calcTotalInterestForBet(bubbles, interest, dec15th2016, jan15th2017),
            TEN
          );
        });
      });
      describe(`when today is ${FEB_28_2017}`, () => {
        const feb28th2017 = moment(FEB_28_2017, MOMENT_FORMAT);
        it(`should return an interest value of ${TWENTY_FIVE}`, () => {
          assert.strictEqual(
            calcTotalInterestForBet(bubbles, interest, dec15th2016, feb28th2017),
            TWENTY_FIVE
          );
        });
      });
      describe(`when today matches the calc date (${DEC_15_2016})`, () => {
        it(`should return interest value of ${ZERO}`, () => {
          assert.strictEqual(
            calcTotalInterestForBet(bubbles, interest, dec15th2016, dec15th2016),
            ZERO
          );
        });
      });
    });
    describe('when a 100 bubble bet was made after the interest calc date', () => {
      // Note: I can imagine this situation arising in a report that displays interest accumlations overtime.
      const betDate = moment(DEC_15_2016, MOMENT_FORMAT);
      const calcAsOfDate = moment(DEC_01_2016, MOMENT_FORMAT);
      it(`should return an interest value of ${ZERO}`, () => {
        assert.strictEqual(
          calcTotalInterestForBet(bubbles, interest, betDate, calcAsOfDate),
          ZERO
        );
      });
    });
    describe(`when a 100 bubble bet was on ${DEC_15_2016} at 0%`, () => {
      const jan15th2017 = moment(DEC_15_2016, MOMENT_FORMAT);
      const interest = 0;
      describe(`when today is ${JAN_15_2017}`, () => {
        it(`should return an interest value of ${ZERO}`, () => {
          assert.strictEqual(
            calcTotalInterestForBet(bubbles, interest, dec15th2016, jan15th2017),
            ZERO
          );
        });
      });
    });
  });
});