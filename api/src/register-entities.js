import { EntityRegistry } from "@schorts/shared-kernel";

import User from "./modules/app/users/domain/entities/user/index.js";

EntityRegistry.register("users", User);
