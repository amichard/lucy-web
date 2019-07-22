import { Injectable } from '@angular/core';
import { Jurisdiction, InvasivePlantSpecies } from '../models';
import { CodeTableService } from './code-table.service';

export interface DropdownObject {
  name: string;
  object: any;
}

@Injectable({
  providedIn: 'root'
})

export class DropdownService {

  public displayedJuristictionsField = `code`;
  public displayedInvasivePlantspeciesField = `latinName`;
  public displayedAgencyField = `description`;
  public displayedDistributionField = `description`;
  public displayedDensityField = `code`;
  public displayedSurveyTypeField = 'description';
  public displayedSoilTextureField = 'description';
  public displayedSurveyGeometryField = 'description';
  public displayedSpecificUseCodeField = 'description';

  constructor(private codeTableService: CodeTableService) { }

  /**
   * Create an array of dropdown objects from an array of objects.
   * @param objects array of objects
   * @param displayValue field in objects that should be displayed in dropdown
   */
  public createDropdownObjectsFrom(objects: any[], displayValue: string): DropdownObject[] {
    const dropdownObjects: DropdownObject[] = [];
    for (const object of objects) {
      dropdownObjects.push({
        name: object[displayValue],
        object: object,
      });
    }
    return dropdownObjects;
  }

  /**
   * Fetch juristictions code table, return as array of
   * deopdown objects
   */
  public async getJuristictions(): Promise<DropdownObject[]> {
    const jurisdictions = await this.codeTableService.getJuristictions();
    return this.createDropdownObjectsFrom(jurisdictions, this.displayedJuristictionsField);
  }

  /**
   * Fetch invasive plant species code table, return as array of
   * deopdown objects
   */
  public async getInvasivePlantSpecies(): Promise<DropdownObject[]> {
    const invasivePlantSpecies = await this.codeTableService.getInvasivePlantSpecies();
    return this.createDropdownObjectsFrom(invasivePlantSpecies, this.displayedInvasivePlantspeciesField);
  }

  /**
   * Fetch Distributions code table, return as array of
   * deopdown objects
   */
  public async getDistributions(): Promise<DropdownObject[]> {
    const distributions = await this.codeTableService.getDistributionCodes();
    return this.createDropdownObjectsFrom(distributions, this.displayedDistributionField);
  }

  /**
   * Fetch Density code table, return as array of
   * deopdown objects
   */
  public async getDensities(): Promise<DropdownObject[]> {
    const densities = await this.codeTableService.getDensityCodes();
    return this.createDropdownObjectsFrom(densities, this.displayedDensityField);
  }

  /**
   * Fetch SurveyModes code table, return as array of
   * deopdown objects
   */
  public async getSurveyModes(): Promise<DropdownObject[]> {
    const modes = await this.codeTableService.getSurveyTypeCodes();
    return this.createDropdownObjectsFrom(modes, this.displayedSurveyTypeField);
  }

  /**
   * Fetch SoilTexture code table, return as array of
   * deopdown objects
   */
  public async getSoilTextureCodes(): Promise<DropdownObject[]> {
    const textures = await this.codeTableService.getSoilTextureCodes();
    return this.createDropdownObjectsFrom(textures, this.displayedSoilTextureField);
  }

  /**
   * Fetch SpecificUseCode code table, return as array of
   * deopdown objects
   */
  public async getSpecificUseCodes(): Promise<DropdownObject[]> {
    const useCodes = await this.codeTableService.getSpecificUseCodes();
    return this.createDropdownObjectsFrom(useCodes, this.displayedSpecificUseCodeField);
  }

  /**
   * Fetch Agency code table, return as array of
   * deopdown objects
   */
  public async getAgencies(): Promise<DropdownObject[]> {
    const organizations = await this.codeTableService.getSpeciesAgencyCodes();
    return this.createDropdownObjectsFrom(organizations, this.displayedAgencyField);
  }

  /**
   * Return array of dropdowns to use for testing.
   */
  public async getDummyDropdownObjects(): Promise<DropdownObject[]> {
    const dropdownObjects: DropdownObject[] = [];
    dropdownObjects.push({
      name: `NOT YET IMPLEMENTED.`,
      object: 'item Zero',
    });
    dropdownObjects.push({
      name: `Item One`,
      object: 'item One',
    });
    dropdownObjects.push({
      name: `Item Two`,
      object: 'item Two',
    });
    dropdownObjects.push({
      name: `Item Three`,
      object: 'item Three',
    });
    dropdownObjects.push({
      name: `Item Four`,
      object: 'item Four',
    });
    return dropdownObjects;
  }
}
