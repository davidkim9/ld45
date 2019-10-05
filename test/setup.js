import Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';
import Sinon from 'sinon';
import SinonChai from 'sinon-chai';

Chai.use(ChaiAsPromised);
Chai.use(SinonChai);

global.Sinon = Sinon;
global.expect = Chai.expect;