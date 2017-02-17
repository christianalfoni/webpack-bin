'use strict'

const utils = require('../../server/utils');
const chai = require('chai');
const should = chai.should();
const testBins = require('../mocks/bins');

describe('utilities', () => {

  it('should get entry files', () => {
    let f = testBins[0].files
    let result = utils.getEntry(f)
    console.log(result);

    result.should.be.ok;
    result.should.equal("app.js");
  })
})
