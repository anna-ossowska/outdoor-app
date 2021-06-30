'use strict';

// Main selectors
const form = document.querySelector('form');
const btn = document.querySelector('.btn');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputType = document.getElementById('type');
const workoutsContainer = document.querySelector('.workouts');

// Modal
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalInput = document.querySelector('.modal__input');
const modalSubmit = document.querySelector('.modal__submit');
const modalForm = document.querySelector('.modal__form');

// Messages
const msgInfo = document.querySelector('.message--info');
const msgSuccess = document.querySelector('.message--success');
const msgDanger = document.querySelector('.message--danger');

// Weather
const weatherLocation = document.querySelector('.weather__location');
const weatherIcon = document.querySelector('.weather__icon');
const weatherTemp = document.querySelector('.weather__temp');

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = Date.now().toString().slice(-10);
  constructor(coords, distance, duration, weight) {
    this.coords = coords; // [lat, long]
    this.distance = distance; // km
    this.duration = duration; // min
    this.weight = weight; // kg
  }

  calcSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed();
    return this.speed;
  }

  calcKcal() {
    this.kcal = (
      (this.duration * this.MET * 3.5 * this.weight) /
      200
    ).toFixed();
  }

  _setDescription() {
    // prettier-ignore
    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  MET = 7.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Hiking extends Workout {
  type = 'hiking';
  MET = 6.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Jogging extends Workout {
  type = 'jogging';
  MET = 8;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Kayaking extends Workout {
  type = 'kayaking';
  MET = 5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Sailing extends Workout {
  type = 'sailing';
  MET = 3;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Skating extends Workout {
  type = 'skating';
  MET = 7;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Skiing extends Workout {
  type = 'skiing';
  MET = 7;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Swimming extends Workout {
  type = 'swimming';
  MET = 5.8;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class Walking extends Workout {
  type = 'walking';
  MET = 3.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
    this.calcSpeed();
    this.calcKcal();
    this._setDescription();
  }
}

class App {
  #map;
  #mapZoom = 13;
  #mapEvent;
  #workouts = [];
  weight;
  markers = [];
  constructor() {
    this._displayWorkoutsFromLocalStorage();

    this._getPosition();

    window.addEventListener(
      'load',
      this._displayInfoMsg.bind(this, 'Click on the map to add a new workout')
    );

    form.addEventListener('submit', this._newWorkout.bind(this));

    workoutsContainer.addEventListener(
      'click',
      this._deleteWorkoutFromLocalStorage.bind(this)
    );

    workoutsContainer.addEventListener(
      'click',
      this._moveToLocation.bind(this)
    );

    // Modal
    window.addEventListener('load', this._showModal.bind(this));
    modal.addEventListener('submit', this._hideModal.bind(this));
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      // position coming from the geolocation is passed automatically
      this._loadMap.bind(this),
      function () {
        alert('Error: location cannot be set');
      }
    );
  }

  _loadMap(position) {
    const { latitude: lat, longitude: long } = position.coords;

    this.#map = L.map('map').setView([lat, long], this.#mapZoom);

    // render the local weather
    this._renderWeather(lat, long);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);

    this.#workouts.forEach(workout => this._renderMarkerAndPopup(workout));

    this.#map.on('click', this._showForm.bind(this));
  }

  _renderWeather(lat, long) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=${API_KEY}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Weather cannot be displayed');
        return res.json();
      })
      .then(data => {
        weatherLocation.innerHTML = `${data.name}, ${data.sys.country} `;
        weatherIcon.src = `./images/${data.weather[0].icon}.png`;
        weatherTemp.innerHTML = `${data.main.temp.toFixed(1)}°​C`;
      })

      .catch(err => {
        console.error(err.message);
      });
  }

  _showForm(e) {
    this.#mapEvent = e;
    const { lat, lng } = e.latlng;
    this.coords = [lat, lng];
    inputDistance.focus();
    form.classList.remove('form--hidden');
  }

  _hideForm() {
    form.style.display = 'none';

    form.classList.add('form--hidden');

    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  _newWorkout(e) {
    e.preventDefault();

    // Data comming from the form
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const type = inputType.value;

    let workout;

    const checkIfAllNumbers = function (...inputs) {
      return inputs.every(inp => isFinite(inp));
    };

    const checkIfAllPositive = function (...inputs) {
      return inputs.every(inp => inp > 0);
    };

    // Display error messages if inputs are incorrect
    if (
      !checkIfAllNumbers(+distance, +duration) ||
      !checkIfAllPositive(+distance, +duration)
    ) {
      // Display message
      this._displayDangerMsg('Please provide the positive numeric values');

      // Clear input fields
      inputDistance.value = inputDuration.value = '';

      return;
    }

    // Create a new object based on workout type
    // 1. Cycling
    if (type === 'cycling') {
      workout = new Cycling(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 2. Hiking
    if (type === 'hiking') {
      workout = new Hiking(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 3. Jogging
    if (type === 'jogging') {
      workout = new Jogging(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 4. Kayaking
    if (type === 'kayaking') {
      workout = new Kayaking(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 5. Sailing
    if (type === 'sailing') {
      workout = new Sailing(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 6. Skating
    if (type === 'skating') {
      workout = new Skating(this.coords, distance, duration, this.weight);

      this.#workouts.push(workout);
    }

    // 7. Skiing
    if (type === 'skiing') {
      workout = new Skiing(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 8. Swimming
    if (type === 'swimming') {
      workout = new Swimming(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // 9. Walking
    if (type === 'walking') {
      workout = new Walking(this.coords, distance, duration, this.weight);
      this.#workouts.push(workout);
    }

    // Add workout to the UI
    this._addWorkoutToUI(workout);

    // Display marker and popup
    this._renderMarkerAndPopup(workout);

    // Clear input fields
    inputDistance.value = inputDuration.value = '';

    // Hide form
    this._hideForm();

    // set the LocalStorage
    this._setLocalStorage(this.#workouts);

    // Display message
    this._displaySuccessMsg('Workout has been successfully added');

    // Render weather
    this._renderWeather(workout.coords[0], workout.coords[1]);
  }

  // LOCAL STORAGE

  _setLocalStorage(workouts) {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  _getWorkoutsFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    return (this.#workouts = data);
  }

  _displayWorkoutsFromLocalStorage() {
    this._getWorkoutsFromLocalStorage();

    this.#workouts.forEach(workout => {
      this._addWorkoutToUI(workout);
    });
  }

  _deleteWorkoutFromLocalStorage(e) {
    if (e.target.classList.contains('workout__delete')) {
      const workoutEl = e.target.closest('.workout');
      if (!workoutEl) return;

      const WorkoutElId = workoutEl.dataset.id;
      if (!WorkoutElId) return;

      // Get all workouts from the Local Storage
      this._getWorkoutsFromLocalStorage();

      // Remove selected Wrokout from the Local Storage
      const filteredWorkouts = this.#workouts.filter(
        workout => workout.id !== WorkoutElId
      );

      // Hide selected workout from UI
      workoutEl.style.display = 'none';

      // Remove markers
      this._removeMarkers(WorkoutElId);

      // Update the Local Storage
      this._setLocalStorage(filteredWorkouts);

      // Display message
      this._displayDangerMsg('Workout has been successfully deleted');
    }
  }

  _removeMarkers(id) {
    // Find workout by its id
    const workout = this.#workouts.find(workout => workout.id === id);

    if (!workout) return;

    // Find marker by its coordinates
    const marker = this.markers.find(marker => {
      const { lat, lng } = marker._latlng;
      return lat === workout.coords[0] && lng === workout.coords[1];
    });

    if (!marker) return;

    // Remove marker from the map
    this.#map.removeLayer(marker);
  }

  _checkWorkoutType(type) {
    switch (type) {
      case 'cycling':
        return '🚴‍♂️';
      case 'hiking':
        return '⛰️';
      case 'jogging':
        return '🏃🏼‍♀️';
      case 'kayaking':
        return '🚣‍♀️';
      case 'sailing':
        return '⛵';
      case 'skating':
        return '⛸️';
      case 'skiing':
        return '🎿';
      case 'swimming':
        return '🏊🏿‍♀️';
      case 'walking':
        return '🚶🏻‍♀️';
    }
  }

  _addWorkoutToUI(workout) {
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <div class="workout__header">
        <h2 class="workout__description">${workout.description}</h2>
        <p class="workout__delete">&times;</p>
      </div>

        <div class="workout__details">
          <span class="workout__distance">${this._checkWorkoutType(
            workout.type
          )} ${workout.distance} <span class="unit">km</span></span>
          <span class="workout__duration">⏱️ ${
            workout.duration
          } <span class="unit">min</span></span>
          <span class="workout__speed">💨 ${
            workout.speed
          } <span class="unit">km/h</span></span>
          <span class="workout__kcal">🔥 ${
            workout.kcal
          } <span class="unit">kcal</span></span>
        </div>
      </li>
    `;

    setTimeout(() => {
      form.insertAdjacentHTML('afterend', html);
    }, 10);
  }

  _renderMarkerAndPopup(workout) {
    const greyIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const popup = L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: 'popup',
    }).setContent(
      `${this._checkWorkoutType(workout.type)} ${workout.description}`
    );

    const marker = L.marker([...workout.coords], { icon: greyIcon })
      .addTo(this.#map)
      .bindPopup(popup)
      .openPopup();

    this.markers.push(marker);
  }

  _moveToLocation(e) {
    if (!e.target.classList.contains('workout__delete')) {
      const workoutEl = e.target.closest('.workout');
      if (!workoutEl) return;
      const workoutId = workoutEl.dataset.id;

      const workout = this.#workouts.find(workout => workout.id === workoutId);

      this.#map.setView(workout.coords, this.#mapZoom, {
        animate: true,
        duration: 1,
      });

      // Render weather
      this._renderWeather(workout.coords[0], workout.coords[1]);
    }
  }

  // UI messages
  _displayInfoMsg(msg) {
    if (this.#workouts.length === 0) {
      msgInfo.classList.remove('message--hidden');
      msgInfo.textContent = msg;

      // If click on map detected, remove the info message
      this.#map.on('click', function () {
        msgInfo.classList.add('message--hidden');
      });
    }
  }

  _displaySuccessMsg(msg) {
    msgSuccess.classList.remove('message--hidden');
    msgSuccess.textContent = msg;
    setTimeout(() => msgSuccess.classList.add('message--hidden'), 4000);
  }

  _displayDangerMsg(msg) {
    msgDanger.classList.remove('message--hidden');
    msgDanger.textContent = msg;
    setTimeout(() => msgDanger.classList.add('message--hidden'), 4000);
  }

  _showModal() {
    setTimeout(() => {
      modal.classList.remove('modal--hidden');
      overlay.classList.remove('overlay--hidden');
    }, 100);
  }

  _hideModal(e) {
    e.preventDefault();
    modal.classList.add('modal--hidden');
    overlay.classList.add('overlay--hidden');

    this.weight = +modalInput.value;
  }
}

const app = new App();
