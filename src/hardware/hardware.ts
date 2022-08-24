/**
 * Abstract class radio hardware
 * Currently supporting mac or pi
 *
 */
import InputHandler from '../radio/input-handler';

export default abstract class Hardware {
  protected constructor(readonly handler: InputHandler) {}
}
