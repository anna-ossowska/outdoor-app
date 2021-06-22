const form = document.querySelector('form');
const btn = document.querySelector('.btn');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputType = document.getElementById('type');
const workoutsContainer = document.querySelector('.workouts');

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = Date.now().toString().slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, long]
    this.distance = distance; // km
    this.duration = duration; // min
  }

  calcSpeed() {
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    return this.speed;
  }
}

class Jogging extends Workout {
  type = 'jogging';
  constructor(coords, distance, duration) {
    super(coords, distance, duration);
  }
}

class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration) {
    super(coords, distance, duration);
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));
  }

  _getPosition = function () {
    navigator.geolocation.getCurrentPosition(
      // position coming from the geolocation is passed automatically
      this._loadMap.bind(this),
      function () {
        alert('Error: location cannot be set');
      }
    );
  };

  _loadMap = function (position) {
    const { latitude: lat, longitude: long } = position.coords;

    this.#map = L.map('map').setView([lat, long], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
  };

  _showForm(e) {
    this.#mapEvent = e;
    const { lat, lng } = e.latlng;
    this.coords = [lat, lng];
    inputDistance.focus();
    form.classList.remove('form--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // Data comming from the form
    const distance = inputDistance.value;
    const duration = inputDuration.value;
    const type = inputType.value;

    let workout;

    console.log(this.coords);

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
    }).setContent('My workout');

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
      alert('Please provide the positive numeric values');

      // Clear input fields
      inputDistance.value = inputDuration.value = '';

      return;
    }

    // Create a new object based on workout type (Jogging)
    if (type === 'jogging') {
      workout = new Jogging(this.coords, distance, duration);
      this.#workouts.push(workout);
    }

    // Create a new object based on workout type (Cycling)
    if (type === 'cycling') {
      workout = new Cycling(this.coords, distance, duration);
      this.#workouts.push(workout);
    }

    console.log(this.#workouts);

    // Add workout to the UI
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__header">Jogging on
        ${months[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
        <div class="workout__details">
          <span class="workout__distance">🏃🏼‍♀️ ${workout.distance} km</span>
          <span class="workout__duration">⏱️ ${workout.duration} min</span>
          <span class="workout__speed">💨 ${workout.calcSpeed()} km/h</span>
        </div>
      </li>
    `;

    form.insertAdjacentHTML('afterend', html);

    // Display marker and popup
    L.marker([...this.coords], { icon: greyIcon })
      .addTo(this.#map)
      .bindPopup(popup)
      .openPopup();

    // Clear input fields
    inputDistance.value = inputDuration.value = '';

    // Hide form
    form.classList.add('form--hidden');
  }
}

const app = new App();

// const workout = new Workout(222, 5, 40);
// console.log(workout);

// const jogging = new Jogging(222, 1, 5);
// console.log(jogging.calcSpeed());

// const cycling = new Cycling(333, 2, 10);
// console.log(cycling.calcSpeed());
