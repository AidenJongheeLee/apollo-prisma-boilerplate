import merge from "lodash/merge";

import { resolvers as userResolvers } from "./userResolvers";
import { resolvers as postResolvers } from "./postResolvers";
import { resolvers as commentResolvers } from "./commentResolvers";
import { resolvers as authResolvers } from "./authResolvers";

export default merge(
  userResolvers,
  postResolvers,
  commentResolvers,
  authResolvers
);
