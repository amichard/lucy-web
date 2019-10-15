/**
 * Imports
 */
import {
    Observation,
    ObservationUpdateModel
} from '../observation';
import { MechanicalTreatment } from '../mechanical.treatment';
import { RecordController } from '../generic.data.models';
import { MechanicalTreatmentController } from './mechanicalTreatment.controller';
import { setNull } from '../../../libs/utilities';
import { User } from '../user';
import { DataModelController } from '../../data.model.controller';
import { JurisdictionCode} from '../observation.codes';
import { Species } from '../species';
import { ObservationSchema, SpeciesSchema, JurisdictionCodeSchema } from '../../database-schema';

/**
 * @description Request body of observation create
 */

/**
 * @description Data Model controller for Observation
 */
export class ObservationController extends RecordController<Observation> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): ObservationController {
        return this.sharedInstance<Observation>(Observation, ObservationSchema) as ObservationController;
    }

    public async findById(id: number): Promise<Observation> {
        const item: Observation = await super.findById(id) as Observation;
        if (item) {
            const mts = await item.mechanicalTreatmentsFetcher || [];
            const newItems: MechanicalTreatment[] = [];
            if (mts.length > 0) {
                const newMts = await mts.map(async (mt) => {
                    return MechanicalTreatmentController.shared.findById(mt.mechanical_treatment_id);
                });
                for (let i = 0; i < newMts.length; i++) {
                    const mtFull = await newMts[i];
                    delete(mtFull.observation);
                    newItems.push(mtFull);
                }
                item.mechanicalTreatments = newItems;
            }
        }
        return item;
    }

    /**
     * @description Update observation
     * @param Observation observation:  Input observation
     * @param ObservationUpdateModel update: Input values
     * @param  User user : Update by
     */
    async updateObject(obj: Observation, data: ObservationUpdateModel, modifier: User) {
        if (data.sampleTakenIndicator === false) {
            setNull<Observation>(obj, 'sampleIdentifier');
         }
         return super.updateObject(obj, data, modifier);
    }
}

/**
 * @description Data Model controller for Species
 */
export class SpeciesController extends DataModelController<Species> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): SpeciesController {
        return this.sharedInstance<Species>(Species, SpeciesSchema) as SpeciesController;
    }
}

/**
 * @description Data Model controller for JurisdictionCode
 */
export class JurisdictionCodeController extends DataModelController<JurisdictionCode> {
    /**
     * @description Getter for shared instance
     */
    public static get shared(): JurisdictionCodeController {
        return this.sharedInstance<JurisdictionCode>(JurisdictionCode, JurisdictionCodeSchema) as JurisdictionCodeController;
    }
}

// -----------------------------------------------------------------------------------------------------------