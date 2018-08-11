import {ObjectMap} from './collection';

export interface EnvVarWrap {
    env: ObjectMap<string | undefined>;
}
