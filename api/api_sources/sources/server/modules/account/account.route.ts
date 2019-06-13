/**
 * Account route and controllers
 */

import * as assert from 'assert';
import { Request, Response, Router} from 'express';
import { SecureRouteController, adminOnlyRoute, BaseRoutController, RouteHandler } from '../../core';
import { UserDataController, User, RoleCodeController, RolesCode } from '../../../database/models';
import { userMessagesRoute } from './messages.route';

interface UserUpdateRequestData {
    firstName?: string;
    lastName?: string;
    roles?: number[];
    accountStatus?: number;
}

/**
 * @description Route controller to fetch all routes
 */
class RolesRouteController extends BaseRoutController<RoleCodeController> {
    constructor() {
        super();
        this.dataController = RoleCodeController.shared;

        // Routes
        this.router.get('/', this.index);
    }

    get index(): RouteHandler {
        return async (req: Request, resp: Response) => {
            assert(req, 'No request object');
            const roles = await this.dataController.all();
            return resp.status(200).json(this.successResp(roles));
        };
    }
}
/**
 * AccountRouteController
 * @description Account route controller
 */
 class AccountRouteController extends SecureRouteController<UserDataController> {
     roleRouteController: RolesRouteController = new RolesRouteController();
     constructor() {
         super();
         this.dataController = UserDataController.shared;

         this.logger.info('Creating Account route controller');

         // Route Configure
         // Get roles
         this.router.use('/roles', this.roleRouteController.router);

         // User messages
         this.router.use('/message', userMessagesRoute());

         // Get own info
         this.router.get('/me', this.me);

         // Update own info
         this.router.put('/me', this.update);

         // Get user info
         this.router.get('/user/:userId', [adminOnlyRoute()], this.index);

         // Update user
         this.router.put('/user/:userId', [adminOnlyRoute()], this.update);
         // Get All users
         this.router.get('/users', [adminOnlyRoute()], this.index);
     }

     /**
      * @description User info route handling
      * @return RouteHandler
      */
     get me(): RouteHandler {
         return async (req: Request, res: Response) => {
            assert(req);
            assert(req.user);
            return res.status(200).json(this.successResp(req.user || req['appUser']));
         };
     }

     /**
      * @description User info update route
      * @return RouteHandler
      */
     get update(): RouteHandler {
         return async (req: Request, resp: Response) => {
             try {
                const update: UserUpdateRequestData = req.body as UserUpdateRequestData;
                assert(update, 'Unknown request body, should handle by validator');
                let user: User;
                if (req.params.userId) {
                    // Getting user
                    user = await this.dataController.findById(req.params.userId);
                    if (user) {
                       this.logger.info(`Will update user by admin => ${user.email}`);
                       await this.updateUserByAdmin(user, update);
                    } else {
                        this.logger.info(`No User - should handled by middleware`);
                        resp.status(422).json(this.getErrorJSON(`User id (${req.params.userId}) not exists, should handled by middleware`, []));
                    }
                } else {
                   user = req.user;
                   this.logger.info(`Will update me => ${user.email}`);
                }


                // Save users
                // Updating firstName and lastName
                user.firstName = update.firstName || user.firstName;
                user.lastName = update.lastName || user.lastName;

                // Saving
                await this.dataController.saveInDB(user);
                this.logger.info(`Update user ${user.email}`);
                // Response
                resp.status(200).json(this.successResp(user, 'Data Updated'));

             } catch (excp) {
                this.commonError(500, 'update', excp, resp);
                return;
             }
         };
     }

     /**
      * @description Any user or all users info route handling
      * @return RouteHandler
      */
     get index(): RouteHandler {
         return async (req: Request, resp: Response) => {
            try {
                // Get user requested user id
                let result: User[] | User = [];
                if (req.params.userId) {
                    result = await this.dataController.findById(req.params.userId);
                } else {
                    result = await this.dataController.all();
                }
                return resp.status(200).json(this.successResp(result));
            } catch (excp) {
                this.commonError(500, 'index', excp, resp);
                return;
            }
         };
     }

     /**
      * Helpers
      */
     /**
      * @description Helper method to update user by admin
      * @param User user
      * @param UserUpdateRequestData update
      */
     async updateUserByAdmin(user: User, update: UserUpdateRequestData) {
         // Save roles if any, role update only available from user in param
         const roles: number[] = update.roles || [];
         if (roles.length > 0) {
             const userRoles: RolesCode[] = [];
             for (const role of roles) {
                 const roleCode = await RoleCodeController.shared.findById(role);
                 if (roleCode) {
                     userRoles.push(roleCode);
                 }
             }
             if (userRoles.length > 0) {
                 this.logger.info(`Adding user roles => ${JSON.stringify(roles)}`);
                 user.roles = userRoles;
             }
         }

         // Update account status if any
         user.accountStatus = update.accountStatus || user.accountStatus;

         return;
     }

 }

 export const accountRoute = (): Router => {
    const controller = new AccountRouteController();
    return controller.router;
 };

// ---------



