//
// Login Data Model Tests
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Pushan Mitra on 2019-06-10.

import { User, UserDataController, RolesCodeValue, UserSession, UserSessionDataController, SessionActivity, SessionActivityCodeValues, SessionActivityController } from '../models';
// import { SharedDBManager } from '../dataBaseManager';
import { userFactory, sessionFactory, sessionActivityFactory } from '../factory';

jest.mock('../data.model.controller');

describe('Test Login Data Model', () => {
    beforeAll(async () => {
        return;
    });
    afterAll(async () => {
        return;
    });
    test('-should create/fetch model (admin)-', async (done) => {
        const user = await userFactory(RolesCodeValue.admin);
        expect(user).toBeDefined();
        if (user) {
            // Fetching
            const dbUser: User  = await UserDataController.shared.fetchOne({ email : user.email});
            expect(dbUser).toBeDefined();
            expect(dbUser.email).toEqual(user.email);
            expect(dbUser.firstName).toEqual(user.firstName);
            expect(dbUser.lastName).toEqual(user.lastName);
            expect(dbUser.roles).toBeDefined();
            expect(dbUser.roles[0].code).toEqual(RolesCodeValue.admin);

            // Cleaning
            await UserDataController.shared.remove(user);
        }

        done();
    });


    test('should fail to fetch user', async (done) => {
        const user: User = await UserDataController.shared.fetchOne({ email: 'ios.dev@email.com'});
        expect(user).toBeUndefined();
        expect(UserSession).toBeDefined();
        expect(UserSessionDataController).toBeDefined();
        expect(SessionActivity).toBeDefined();
        expect(SessionActivityController).toBeDefined();
        expect(SessionActivityCodeValues).toBeDefined();
        expect(sessionActivityFactory).toBeDefined();
        expect(sessionFactory).toBeDefined();
        done();
    });

    test('should create / fetch UserSession', async (done) => {
        // Create user-session
        const userSession = await sessionFactory(RolesCodeValue.admin);
        expect(userSession).toBeDefined();

        // Save user
        await UserDataController.shared.saveInDB(userSession.user);
        await UserSessionDataController.shared.saveInDB(userSession);

        // Save user current session
        await UserDataController.shared.setCurrentSession(userSession.user, userSession);

        const dbSession: UserSession = await UserSessionDataController.shared.fetchOne( {
            token: userSession.token
        });
        // Checking basic data
        expect(dbSession.lastLoginAt).toEqual(userSession.lastLoginAt);
        expect(dbSession.lastActiveAt).toEqual(userSession.lastActiveAt);
        expect(dbSession.tokenLifeTime).toEqual(userSession.tokenLifeTime);

        // Checking user relationship
        expect(dbSession.user).toBeDefined();
        expect(dbSession.user.email).toEqual(userSession.user.email);

        // Checking currentSession relationship of user
        const currentSession: UserSession = await UserDataController.shared.getCurrentSession(dbSession.user);
        expect(currentSession).toBeDefined();
        expect(currentSession.session_id).toEqual(dbSession.session_id);

        await UserDataController.shared.remove(userSession.user);
        await UserSessionDataController.shared.remove(userSession);
        done();
    });

    test('should create/fetch session activity', async (done) => {
        // Create session
        const sessionActivity: SessionActivity = await sessionActivityFactory(SessionActivityCodeValues.dataAdd);

        // Save
        await UserDataController.shared.saveInDB(sessionActivity.session.user);
        await UserSessionDataController.shared.saveInDB(sessionActivity.session);
        await SessionActivityController.shared.saveInDB(sessionActivity);

        // Fetch
        const fetchValues: SessionActivity = await SessionActivityController.shared.findById(sessionActivity.activity_id);

        // Test
        expect(fetchValues.session).toEqual(sessionActivity.session);
        expect(fetchValues.info).toEqual(sessionActivity.info);
        expect(fetchValues.code).toEqual(sessionActivity.code);

        // Remove
        const session = sessionActivity.session;
        const user = session.user;
        await SessionActivityController.shared.remove(sessionActivity);
        await UserSessionDataController.shared.remove(session);
        await UserDataController.shared.remove(user);

        done();
    });
});

// ---------------
