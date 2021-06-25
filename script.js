const form = document.querySelector('form');
const btn = document.querySelector('.btn');
const inputDistance = document.getElementById('distance');
const inputDuration = document.getElementById('duration');
const inputType = document.getElementById('type');
const workoutsContainer = document.querySelector('.workouts');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalInput = document.querySelector('.modal__input');
const modalSubmit = document.querySelector('.modal__submit');
const modalForm = document.querySelector('.modal__form');

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
    this.speed = (this.distance / (this.duration / 60)).toFixed(1);
    return this.speed;
  }

  calcKcal() {
    return ((this.duration * this.MET * 3.5 * this.weight) / 200).toFixed();
  }

  _setDescription() {
    return `${
      this.type[0].toUpperCase() + this.type.slice(1)
    } on ${this.date.getDate()} ${months[this.date.getMonth()]}`;
  }
}

class Cycling extends Workout {
  type = 'cycling';
  MET = 7.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Hiking extends Workout {
  type = 'hiking';
  MET = 6.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Jogging extends Workout {
  type = 'jogging';
  MET = 8;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Kayaking extends Workout {
  type = 'kayaking';
  MET = 5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Sailing extends Workout {
  type = 'sailing';
  MET = 3;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Skating extends Workout {
  type = 'skating';
  MET = 7;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Skiing extends Workout {
  type = 'skiing';
  MET = 7;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Swimming extends Workout {
  type = 'swimming';
  MET = 5.8;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class Walking extends Workout {
  type = 'walking';
  MET = 3.5;
  constructor(coords, distance, duration, weight) {
    super(coords, distance, duration, weight);
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  weight;
  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));

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

    this.#map = L.map('map').setView([lat, long], 13);

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));
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

    // WEIGHT saved inside app obj
    console.log(this.weight);

    // Data comming from the form
    const distance = inputDistance.value;
    const duration = inputDuration.value;
    const type = inputType.value;

    let workout;

    console.log(this.coords);

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

    // Create a new object based on workout type
    // 1. Cycling
    if (type === 'cycling') {
      workout = new Cycling(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 2. Hiking
    if (type === 'hiking') {
      workout = new Hiking(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      console.log(workout.type);
      this.#workouts.push(workout);
    }

    // 3. Jogging
    if (type === 'jogging') {
      workout = new Jogging(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 4. Kayaking
    if (type === 'kayaking') {
      workout = new Kayaking(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 5. Sailing
    if (type === 'sailing') {
      workout = new Sailing(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 6. Skating
    if (type === 'skating') {
      workout = new Skating(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 7. Skiing
    if (type === 'skiing') {
      workout = new Skiing(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 8. Swimming
    if (type === 'swimming') {
      workout = new Swimming(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    // 9. Walking
    if (type === 'walking') {
      workout = new Walking(this.coords, distance, duration, this.weight);
      console.log(workout.calcKcal());
      this.#workouts.push(workout);
    }

    console.log(this.#workouts);

    // Add workout to the UI
    this._addWorkoutToUI(workout);

    // Display marker and popup
    this._renderMarkerAndPopup(workout);

    // Clear input fields
    inputDistance.value = inputDuration.value = '';

    // Hide form
    this._hideForm();
  }

  _addWorkoutToUI(workout) {
    const checkWorkoutType = function (type) {
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
    };
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__header">Jogging on
        ${months[workout.date.getMonth()]} ${workout.date.getDate()}</h2>
        <div class="workout__details">
          <span class="workout__distance">${checkWorkoutType(workout.type)} ${
      workout.distance
    } km</span>
          <span class="workout__duration">⏱️ ${workout.duration} min</span>
          <span class="workout__speed">💨 ${workout.calcSpeed()} km/h</span>
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
    }).setContent(workout._setDescription());

    L.marker([...workout.coords], { icon: greyIcon })
      .addTo(this.#map)
      .bindPopup(popup)
      .openPopup();
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

// const workout = new Workout(222, 5, 40);
// console.log(workout);

// const jogging = new Jogging(222, 1, 5);
// console.log(jogging.calcSpeed());

// const cycling = new Cycling(333, 2, 10);
// console.log(cycling.calcSpeed());

// const hiking = new Hiking(333, 2, 10, 55);
// console.log(hiking.type);
