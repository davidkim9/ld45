import { setTime } from '../action/actions';
import { Logger } from '../util/logger';
import { RenderController } from './render-controller';
import { getTime } from '../model/selector/selectors';
import { getNewStore, getInitialState } from '../model/store';
import TimeManager from '../util/time-manager';

export default class MainController {
  constructor(canvas) {
    this.logger = new Logger('MainController');
    Logger.setDebugMode(true);
    
    this.store = getNewStore(getInitialState());
    this.timeManager = new TimeManager();
    this.renderController = new RenderController(canvas, this.timeManager);
  }

  init() {
    this.logger.log('Initialize');
    this.timeManager.register(dt => this.update(dt));
    this.timeManager.start();
    this.renderController.init();
  }

  update(dt) {
    let currentTime = getTime(this.store.getState());
    this.store.dispatch(setTime(currentTime + dt));
  }
}
