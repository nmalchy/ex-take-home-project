import NodeCache from "node-cache";
import { CACHE_TIME_TO_LIVE_IN_SECONDS } from "../constants/config";

export const cache: NodeCache = new NodeCache({ stdTTL: CACHE_TIME_TO_LIVE_IN_SECONDS });
