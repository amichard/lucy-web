import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormMode } from 'src/app/models';
import { InvasivePlantSpecies, SpeciesObservations, Jurisdiction } from 'src/app/models/observation';
import { CodeTableService } from 'src/app/services/code-table.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-add-plant-observation-invasive-plant-species',
  templateUrl: './add-plant-observation-invasive-plant-species.component.html',
  styleUrls: ['./add-plant-observation-invasive-plant-species.component.css']
})
export class AddPlantObservationInvasivePlantSpeciesComponent implements OnInit {

  get buttonTitle(): string {
    if (!this.objects.length) {
      return '+ Add a species to location';
    }
    if (this.objects.length < 1) {
      return `+ Add a species to location`;
    } else {
      return `+ Add another species to location`;
    }
  }

  get isViewMode(): boolean {
    return this._mode === FormMode.View;
  }
  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  // Get
  get mode(): FormMode {
    return this._mode;
  }
  // Set
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  ///// Invasive plant objects
  private _objects: SpeciesObservations[] = [];
  // Get
  get objects(): SpeciesObservations[] {
    return this._objects;
  }
  // Set
  @Input() set objects(objects: SpeciesObservations[]) {
    this._objects = objects;
  }
  ////////////////////

  @Output() invasivePlantSpeciesChanged = new EventEmitter<SpeciesObservations[]>();

  constructor(private codeTableService: CodeTableService, private loadingService: LoadingService) { }

  ngOnInit() {
  }

  // TODO: Refactor after observation object change
  addNewSpecies(): SpeciesObservations {
    return this.addSpecies(undefined, undefined, undefined, 0, 0, undefined);
  }

  // TODO: Refactor after observation object change
  addSpecies(id: number, species: InvasivePlantSpecies, jurisdiction: Jurisdiction, width: number, length: number, accessDescription: string): SpeciesObservations {
    const newSpecies = {
      observationSpecies_Id: id ? id : this.getUniqueId(),
      species: species,
      jurisdiction: jurisdiction,
      density: undefined,
      distribution: undefined,
      surveyType: undefined,
      surveyGeometry: undefined,
      specificUseCode: undefined,
      soilTexture: undefined,
      surveyorFirstName: undefined,
      surveyorLastName: undefined,
      speciesAgency: undefined,
      width: width,
      length: length,
      accessDescription: accessDescription,
    };
    this.objects.push(newSpecies);
    return(newSpecies);
  }

  private getUniqueId(): number {
    if (this.objects.length < 1) {
      return 0;
    }
    const usedIds: number[] = [];
    for (const object of this.objects) {
      usedIds.push(object.observationSpecies_Id);
    }

    const sortedUsedIds = usedIds.sort((n1, n2) => n1 - n2);
    return sortedUsedIds.pop() + 1;
  }

  speciesCellInfoChanged(event: SpeciesObservations) {
    for (const i in this.objects) {
      if (this.objects[i].observationSpecies_Id === event.observationSpecies_Id) {
        this.objects[i] = event;
        this.notifyChangeEvent();
      }
    }
  }

  private notifyChangeEvent() {
    if (this.objects) {
      this.invasivePlantSpeciesChanged.emit(this.objects);
    }
  }
}
