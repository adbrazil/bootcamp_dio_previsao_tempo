import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subject,combineLatest} from 'rxjs';
import { takeUntil,map } from 'rxjs/operators';
import { Bookmark } from 'src/app/shared/models/bookmark.model';
import { CityWeather } from 'src/app/shared/models/weather.model';


import { Units } from 'src/app/shared/models/units.enum';


import * as fromHomeSelectors from '../../state/home.selectors'

import * as fromHomeActions from '../../state/home.actions'

import * as fromBookmarksSelectors from '../../../bookmarks/state/bookmarks.selectors'


import * as fromConfigSelectors from '../../../../shared/state/config/config.selectors'
import { CityTypeaheadItem } from 'src/app/shared/models/city-typeahead-item.model';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css']
})
export class HomePage implements OnInit,OnDestroy {

  form:FormGroup;

  searchControlWithAutocomplete: FormControl;

  text:string;

  cityWeather$: Observable<CityWeather>;

  bookmarksList$: Observable<Bookmark[]>;

  isFavorite:boolean;

  cityWeather: CityWeather
  loading$: Observable<boolean>
  error$: Observable<boolean>

  isCurrentFavorite$: Observable<boolean>;

  unit$: Observable<Units>;


  private componentDestroyed$ = new Subject();

  constructor(private formBuilder: FormBuilder ,private store:Store) { }

  ngOnInit(): void {


    this.form = this.formBuilder.group({
      pesquisar: [null, [Validators.required]],
    })

    this.searchControlWithAutocomplete = new FormControl(undefined);
    


    this.searchControlWithAutocomplete.valueChanges
    .pipe(takeUntil(this.componentDestroyed$))
    .subscribe((value: CityTypeaheadItem) => {
      if (!!value) {
        this.store.dispatch(fromHomeActions.loadCurrentWeatherById({id: value.geonameid.toString()}));
      }
    });


   this.cityWeather$ = this.store.pipe(select(fromHomeSelectors.selectCurrentWeather)); 

   this.store
   .pipe(select(fromHomeSelectors.selectCurrentWeather),
     takeUntil(this.componentDestroyed$)
     )
   .subscribe(value=> this.cityWeather = value)


   this.loading$=this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherLoading))
   this.error$=this.store.pipe(select(fromHomeSelectors.selectCurrentWeatherError))

  
  this.bookmarksList$ = this.store.pipe(select(fromBookmarksSelectors.selectBookmarksList));


  this.isCurrentFavorite$ = combineLatest([this.cityWeather$, this.bookmarksList$])
      .pipe(
        map(([current, bookmarksList]) => {
         
          if (!!current) {
            return bookmarksList.some(bookmark => bookmark.id === current.city.id);
          }
          return false;
        }),
      );

      this.unit$ = this.store.pipe(select(fromConfigSelectors.selectUnitConfig));

  this.isFavorite=true;

  
  }


  ngOnDestroy(){
     this.componentDestroyed$.next()
     this.componentDestroyed$.unsubscribe()
     this.store.dispatch(fromHomeActions.clearHomeState());
  }

  submit() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form.value);

    const query = this.form.value['pesquisar'];


    this.store.dispatch(fromHomeActions.loadCurrentWeather({query}))
  }

  onToggleBookmark(){
    const bookmark = new Bookmark();

    bookmark.id= this.cityWeather.city.id
    bookmark.name= this.cityWeather.city.name
    bookmark.country= this.cityWeather.city.country
    bookmark.coord= this.cityWeather.city.coord

    this.store.dispatch(fromHomeActions.toggleBookmark({entity:bookmark}))

  }


  

}
