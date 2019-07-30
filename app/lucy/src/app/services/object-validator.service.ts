import { Injectable } from '@angular/core';
import { User, Jurisdiction, InvasivePlantSpecies, Observation, SpeciesDensityCodes, SpeciesDistributionCodes, SpeciesAgencyCodes, ObservationTypeCodes, SoilTextureCodes, ObservationGeometryCodes, SpecificUseCodes, GroundSlopeCodes, GroundAspectCodes, ProposedActionCodes} from '../models';
import { AccessRequest } from '../models/AccessRequest';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class ObjectValidatorService {

  constructor() { }
  /**
   * Check if object is a User object
   * @param user object
   */
  public isUserObject(user: any): user is User {
    if (user === undefined || user === null) { return false; }
    return (<User>user.email) !== undefined;
  }

  /**
   * Check if object is an access request object
   * @param request object
   */
  public isAccessRequestObject(request: any): request is AccessRequest {
    if (request === undefined || request === null) {return false; }
    return this.isUserObject(<AccessRequest>request.requester);
    // return (<AccessRequest>request.role) !== undefined;
  }

  /**
   * Check if object is a role object
   * @param role object
   */
  public isRoleObject(role: any): role is Role {
    if (role === undefined || role === null) {return false; }
    return (<Role>role.role) !== undefined;
  }

  /**
   * Check if object is a jurisdiction object
   * @param jurisdiction object
   */
  public isJurisdictionObject(jurisdiction: any): jurisdiction is Jurisdiction {
    if (jurisdiction === undefined || jurisdiction === null) {return false; }
    return (<Jurisdiction>jurisdiction.code) !== undefined;
  }

  /**
   * Check if object is an invasive plant species object
   * @param species object
   */
  public isInvasivePlantSpeciesObject(species: any): species is InvasivePlantSpecies {
    if (species === undefined || species === null) {return false; }
    return (<InvasivePlantSpecies>species.species) !== undefined;
  }

  /**
   * Check if object is SpeciesDensityCode
   * @param density object
   */
  public isSpeciesDensityCodeObject(density: any): density is SpeciesDensityCodes {
    if (density === undefined || density === null) {return false; }
    return (<SpeciesDensityCodes>density.code) !== undefined;
  }

  /**
   * Check if object is speciesAgencyCode
   * @param distribution object
   */
  public isSpeciesAgencyCodeObject(agency: any): agency is SpeciesAgencyCodes {
    if (agency === undefined || agency === null) {return false; }
    return (<SpeciesAgencyCodes>agency.description) !== undefined;
  }

  /**
   * Check if object is SpeciesDistributionCode
   * @param distribution object
   */
  public isSpeciesDistributionCodeObject(distribution: any): distribution is SpeciesDistributionCodes {
    if (distribution === undefined || distribution === null) {return false; }
    return (<SpeciesDensityCodes>distribution.description) !== undefined;
  }

  /**
   * Check if object is ObservationTypeCodes
   * @param distribution object
   */
  public isObservationTypeCodesObject(observationType: any): observationType is ObservationTypeCodes {
    if (observationType === undefined || observationType === null) {return false; }
    return (<ObservationTypeCodes>observationType.description) !== undefined;
  }

  /**
   * Check if object is soilTextureCodes
   * @param distribution object
   */
  public isSoilTextureCodesObject(soilTexture: any): soilTexture is SoilTextureCodes {
    if (soilTexture === undefined || soilTexture === null) {return false; }
    return (<SoilTextureCodes>soilTexture.description) !== undefined;
  }

  /**
   * Check if object is ObservationGeometryCodes
   * @param distribution object
   */
  public isObservationGeometryCodesObject(observationGeometry: any): observationGeometry is ObservationGeometryCodes {
    if (observationGeometry === undefined || observationGeometry === null) {return false; }
    return (<ObservationGeometryCodes>observationGeometry.description) !== undefined;
  }

  /**
   * Check if object is specificUseCodes
   * @param distribution object
   */
  public isSpecificUseCodesObject(specificUseCodes: any): specificUseCodes is SpecificUseCodes {
    if (specificUseCodes === undefined || specificUseCodes === null) {return false; }
    return (<SpecificUseCodes>specificUseCodes.description) !== undefined;
  }

  /**
   * Check if object is an observation
   * @param observation object
   */
  public isObservationObject(observation: any): observation is Observation {
    if (observation === undefined || observation === null) {return false; }
    return (<Observation>observation.date) !== undefined;
  }

   /**
   * Check if object is ProposedActionCodes
   * @param observation object
   */
  public isProposedActionCodesObject(proposedActionCodes: any): proposedActionCodes is ProposedActionCodes {
    if (proposedActionCodes === undefined || proposedActionCodes === null) {return false; }
    return (<ProposedActionCodes>proposedActionCodes.date) !== undefined;
  }


   /**
   * Check if object is GroundAspectCodes
   * @param observation object
   */
  public isGroundAspectCodesObject(groundAspectCodes: any): groundAspectCodes is GroundAspectCodes {
    if (groundAspectCodes === undefined || groundAspectCodes === null) {return false; }
    return (<GroundAspectCodes>groundAspectCodes.date) !== undefined;
  }

   /**
   * Check if object is GroundSlopeCodes
   * @param observation object
   */
  public isGroundSlopeCodesObject(groundSlopeCodes: any): groundSlopeCodes is GroundSlopeCodes {
    if (groundSlopeCodes === undefined || groundSlopeCodes === null) {return false; }
    return (<GroundSlopeCodes>groundSlopeCodes.date) !== undefined;
  }

}
