// Шлях: container-app/src/components/AddContainerForm.js

import React, { useState } from 'react';

/**
 * Компонент React для форми додавання нового контейнера.
 * Реалізує валідацію полів в реальному часі з візуальною підсвіткою.
 * @param {object} props - Пропси компонента.
 * @param {function} props.onAdd - Функція, що викликається при успішній відправці форми, 
 * передає дані нового контейнера батьківському компоненту.
 */
function AddContainerForm({ onAdd }) {
  
  // --- Стан Компонента (useState) ---
  
  // 1. Стан для зберігання значень полів вводу
  const [id, setId] = useState(''); // Значення поля "ID Контейнера"
  const [location, setLocation] = useState(''); // Значення поля "Місцезнаходження"
  const [destination, setDestination] = useState(''); // Значення поля "Призначення"

  // 2. Стан для зберігання повідомлень про помилки валідації для кожного поля
  const [errors, setErrors] = useState({
    id: '',          // Помилка для ID
    location: '',    // Помилка для Місцезнаходження
    destination: ''  // Помилка для Призначення
  });

  // 3. Стан для відстеження того, чи взаємодіяв користувач з полем (для логіки показу помилок)
  const [touched, setTouched] = useState({
    id: false,         // Чи торкався поля ID?
    location: false,   // Чи торкався поля Місцезнаходження?
    destination: false // Чи торкався поля Призначення?
  });

  // --- Функція Валідації ---

  /**
   * Перевіряє валідність значення конкретного поля.
   * Оновлює стан `errors` відповідним повідомленням про помилку або порожнім рядком.
   * @param {string} fieldName - Назва поля ('id', 'location', 'destination').
   * @param {string} value - Поточне значення поля для перевірки.
   */
  const validateField = (fieldName, value) => {
    let errorMessage = ''; // Початково помилки немає

    // Логіка перевірки залежно від назви поля
    switch (fieldName) {
      case 'id':
        const idRegex = /^[A-Z]{2}-\d{6}$/; // Регулярний вираз для формату XX-123456
        // Якщо поле не порожнє І не відповідає формату
        if (value.length > 0 && !idRegex.test(value)) {
          errorMessage = 'Невірний формат. Очікується XX-123456';
        }
        break;
      case 'location':
        // Якщо поле не порожнє І містить менше 3 символів (без пробілів на початку/кінці)
        if (value.length > 0 && value.trim().length < 3) {
          errorMessage = 'Поле має містити мінімум 3 символи';
        }
        break;
      case 'destination':
        // Аналогічно до location
        if (value.length > 0 && value.trim().length < 3) {
          errorMessage = 'Поле має містити мінімум 3 символи';
        }
        break;
      default:
        // Якщо назва поля невідома, нічого не робимо
        break;
    }
    
    // Оновлюємо стан помилок: копіюємо старі помилки і змінюємо лише для поточного поля
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: errorMessage // [fieldName] - динамічний ключ (id, location або destination)
    }));
  };

  // --- Обробники Подій ---

  /**
   * Обробник події 'onChange' для полів вводу.
   * Викликається при кожному натисканні клавіші.
   * Оновлює відповідний стан значення поля (setId, setLocation, setDestination).
   * Запускає валідацію в реальному часі (`validateField`).
   * @param {React.ChangeEvent<HTMLInputElement>} e - Об'єкт події.
   */
  const handleChange = (e) => {
    // Деструктуризація: отримуємо name ('id', 'location'...) і value з input'а
    const { name, value } = e.target; 

    // Оновлюємо відповідний стан залежно від 'name' поля
    switch (name) {
      case 'id':
        setId(value);
        break;
      case 'location':
        setLocation(value);
        break;
      case 'destination':
        setDestination(value);
        break;
      default:
        break;
    }
    
    // Запускаємо валідацію для цього поля з новим значенням
    validateField(name, value);
  };

  /**
   * Обробник події 'onBlur' для полів вводу.
   * Викликається, коли користувач прибирає фокус з поля (клікає в інше місце).
   * Позначає поле як "торкнуте" (`touched`), щоб помилки почали відображатися.
   * Повторно запускає валідацію.
   * @param {React.FocusEvent<HTMLInputElement>} e - Об'єкт події.
   */
  const handleBlur = (e) => {
    const { name } = e.target; // Отримуємо 'name' поля, яке втратило фокус
    // Оновлюємо стан 'touched', позначаючи це поле як true
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    // Ще раз валідуємо (важливо, якщо користувач залишив поле порожнім)
    validateField(name, e.target.value);
  };
  

  /**
   * Обробник події 'onSubmit' для форми.
   * Викликається при натисканні кнопки "Додати".
   * Запобігає стандартній відправці форми.
   * Примусово показує всі помилки (позначаючи всі поля як 'touched').
   * Перевіряє, чи є помилки валідації або порожні поля.
   * Якщо форма валідна, викликає `onAdd` і очищує форму.
   * @param {React.FormEvent<HTMLFormElement>} event - Об'єкт події.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Забороняємо перезавантаження сторінки
    
    // Позначаємо всі поля як "торкнуті", щоб помилки (якщо є) точно відобразилися
    setTouched({ id: true, location: true, destination: true });

    // Запускаємо валідацію для всіх полів ще раз
    validateField('id', id);
    validateField('location', location);
    validateField('destination', destination);

    let hasErrors = false; // Прапорець для перевірки на порожні поля
    let newErrors = { ...errors }; // Копіюємо поточні помилки валідації

    // Додатково перевіряємо, чи не залишив користувач поля порожніми
    if (id.trim().length === 0) {
      newErrors.id = 'Поле не може бути порожнім'; // Додаємо/перезаписуємо помилку
      hasErrors = true;
    }
    if (location.trim().length === 0) {
      newErrors.location = 'Поле не може бути порожнім';
      hasErrors = true;
    }
    if (destination.trim().length === 0) {
      newErrors.destination = 'Поле не може бути порожнім';
      hasErrors = true;
    }

    // Оновлюємо стан помилок з урахуванням перевірки на порожні поля
    setErrors(newErrors);

    // Фінальна перевірка: чи є хоч одна помилка (з валідації АБО через порожнє поле)
    // Object.values(newErrors) -> ['помилка1', '', '']
    // .some(error => error.length > 0) -> чи є хоч один не порожній рядок?
    if (hasErrors || Object.values(newErrors).some(error => error.length > 0)) {
      console.log('Форма невалідна'); // Повідомлення для розробника в консолі
      return; // Зупиняємо відправку
    }

    // --- Якщо помилок немає ---
    
    // Викликаємо функцію `onAdd`, передану з батьківського компонента (App.js)
    // Передаємо їй об'єкт з даними нового контейнера
    onAdd({ id, location, destination });

    // Очищуємо поля форми, скидаючи їх стан
    setId('');
    setLocation('');
    setDestination('');
    // Скидаємо помилки
    setErrors({ id: '', location: '', destination: '' });
    // Скидаємо статус "торкнутості"
    setTouched({ id: false, location: false, destination: false });
  };
  
  // --- Допоміжна Функція для Стилів ---

  /**
   * Визначає, який CSS-клас ('valid' або 'invalid') додати до поля вводу.
   * @param {string} fieldName - Назва поля ('id', 'location', 'destination').
   * @returns {string} - Повертає 'valid', 'invalid' або порожній рядок ''.
   */
  const getFieldClass = (fieldName) => {
    // Якщо користувач ще не торкався поля, не застосовуємо жодних класів
    if (!touched[fieldName]) return ''; 
    // Якщо для цього поля є помилка в стані `errors`, повертаємо 'invalid'
    if (errors[fieldName]) return 'invalid'; 
    // Якщо помилки немає І поле не порожнє, повертаємо 'valid'
    // (Ми перевіряємо значення поля, щоб не підсвічувати порожні поля зеленим)
    if (fieldName === 'id' && id.length > 0) return 'valid'; 
    if (fieldName === 'location' && location.length > 0) return 'valid';
    if (fieldName === 'destination' && destination.length > 0) return 'valid';
    // В інших випадках (наприклад, поле порожнє і без помилок) - класів немає
    return '';
  };


  // --- JSX Розмітка Компонента ---
  // Це те, що React "намалює" на сторінці
  return (
    // Прив'язуємо нашу функцію handleSubmit до події onSubmit форми
    <form onSubmit={handleSubmit}>
      
      {/* Група для поля ID */}
      <div className="form-group">
        <label htmlFor="containerId">ID Контейнера:</label>
        <input 
          type="text" 
          id="containerId" // id для зв'язки з label
          name="id" // name для обробників handleChange/handleBlur
          placeholder="Напр., UA-987654"
          value={id} // Значення поля береться зі стану
          onChange={handleChange} // Функція, що викликається при зміні
          onBlur={handleBlur} // Функція, що викликається при втраті фокусу
          // Динамічно додаємо клас 'valid' або 'invalid'
          className={getFieldClass('id')} 
        />
        {/* Умовний рендеринг: показуємо div з помилкою ТІЛЬКИ ЯКЩО 
           поле було "торкнуте" (touched.id) І для нього є помилка (errors.id) */}
        {touched.id && errors.id && <div className="error-message">{errors.id}</div>}
      </div>
      
      {/* Група для поля Місцезнаходження (аналогічно до ID) */}
      <div className="form-group">
        <label htmlFor="location">Поточне місцезнаходження:</label>
        <input 
          type="text" 
          id="location"
          name="location"
          value={location}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClass('location')}
        />
        {touched.location && errors.location && <div className="error-message">{errors.location}</div>}
      </div>

      {/* Група для поля Призначення (аналогічно до ID) */}
      <div className="form-group">
        <label htmlFor="destination">Призначення:</label>
        <input 
          type="text" 
          id="destination"
          name="destination"
          value={destination}
          onChange={handleChange}
          onBlur={handleBlur}
          className={getFieldClass('destination')}
        />
        {touched.destination && errors.destination && <div className="error-message">{errors.destination}</div>}
      </div>
      
      {/* Кнопка відправки форми */}
      <button type="submit" className="btn btn-submit">
        Додати
      </button>
    </form>
  );
}

// Експортуємо компонент, щоб його можна було імпортувати в App.js
export default AddContainerForm;