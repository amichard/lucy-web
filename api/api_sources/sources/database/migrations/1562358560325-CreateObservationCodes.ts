//
// Migration file for JurisdictionCode table
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
// Created by Pushan Mitra on 2019-07-05.

import {MigrationInterface, QueryRunner} from 'typeorm';
import { SpeciesDensityCodeSchema, SpeciesDistributionCodeSchema, getSQLFileData } from '../database-schema';
import { SpeciesAgencyCodeSchema } from '../database-schema';
import { ObservationTypeCodeSchema } from '../database-schema';
import { SoilTextureCodeSchema } from '../database-schema';
import { ObservationGeometryCodeSchema } from '../database-schema';
import { SpecificUseCodeSchema } from '../database-schema';
/**
 * @description Migration File create JurisdictionCode table
 */
export class CreateObservationCode1562358560325 implements MigrationInterface {
    densitySchema: SpeciesDensityCodeSchema = new SpeciesDensityCodeSchema();
    distributionSchema: SpeciesDistributionCodeSchema = new SpeciesDistributionCodeSchema();
    agencyCodeSchema: SpeciesAgencyCodeSchema = new SpeciesAgencyCodeSchema();
    observationTypeCodeSchema: ObservationTypeCodeSchema  = new ObservationTypeCodeSchema();
    soilTextureCodeSchema: SoilTextureCodeSchema = new SoilTextureCodeSchema();
    observationGeometryCodeSchema: ObservationGeometryCodeSchema = new ObservationGeometryCodeSchema();
    specificUseCodeSchema: SpecificUseCodeSchema = new SpecificUseCodeSchema();
    /**
     * @description Up method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async up(queryRunner: QueryRunner): Promise<any> {
        // Creating Tables
        await queryRunner.query(this.densitySchema.migrationSQL);
        await queryRunner.query(this.distributionSchema.migrationSQL);
        await queryRunner.query(this.agencyCodeSchema.migrationSQL);
        await queryRunner.query(this.observationTypeCodeSchema.migrationSQL);
        await queryRunner.query(this.soilTextureCodeSchema.migrationSQL);
        await queryRunner.query(this.observationGeometryCodeSchema.migrationSQL);
        await queryRunner.query(this.specificUseCodeSchema.migrationSQL);
        // Pre-load codes
        await queryRunner.query(getSQLFileData(this.densitySchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.distributionSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.agencyCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.observationTypeCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.soilTextureCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.observationGeometryCodeSchema.dataSQLPath()));
        await queryRunner.query(getSQLFileData(this.specificUseCodeSchema.dataSQLPath()));
    }

    /**
     * @description  down method
     * @param QueryRunner queryRunner
     * @return Promise<any>
     */
    public async down(queryRunner: QueryRunner): Promise<any> {
        // Deleting code tables
        await queryRunner.query(this.densitySchema.dropTable());
        await queryRunner.query(this.distributionSchema.dropTable());
        await queryRunner.query(this.agencyCodeSchema.dropTable());
        await queryRunner.query(this.observationTypeCodeSchema.dropTable());
        await queryRunner.query(this.soilTextureCodeSchema.dropTable());
        await queryRunner.query(this.observationGeometryCodeSchema.dropTable());
        await queryRunner.query(this.specificUseCodeSchema.dropTable());

        // Removing some old code table ref
        await queryRunner.query(`DROP TABLE IF EXISTS survey_geometry_code`);
        await queryRunner.query(`DROP TABLE IF EXISTS survey_type_code`);
    }

}
