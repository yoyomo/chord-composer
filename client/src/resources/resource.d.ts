import {UserResource} from "./user-resource";
import {SubscriptionResource} from "./subscription-resource";
import {StripeData, StripeResource} from "./stripe-resource";

export type ResourceType = UserResource | SubscriptionResource | SongResource | StripeResource;
