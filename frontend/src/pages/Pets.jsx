import { useState } from "react";
import { useEffect, useState } from 'react';
import { petsAPI } from '@/api';
import { NavLink } from 'react-router-dom';

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [err, setErr] = useState(null);
  useEffect(() => {
    petsAPI.getAll().then(r => setPets(r.data)).catch(e => setErr(e?.response?.data?.message || e.message));
  }, []);
  const [reviews, setReviews] = useState([
    { id: 1, user: "Алексей", text: "Очень дружелюбный питомец!" },
    { id: 2, user: "Мария", text: "Здоровый и активный, люблю его." },

  ]);

  const [newReview, setNewReview] = useState("");

  const pet = {
    name: "Мия",
    age: "5 месяцев",
    type: "Кошка",
    breed: { father: "Сиамский", mother: "Домашний короткошерстный" },
    color: "Серо-белый с черными отметинами",
    birthDate: "27.04.2025",
    birthPlace: "Казахстан, Алматы",
    currentPlace: "Казахстан, Алматы",
    vaccinations: ["Вакцина 1", "Вакцина 2"],
    health: "Здоровая, без хронических заболеваний",
    photo: "https://placekitten.com/400/300",
    description: "Очень ласковая и игривая кошка, любит внимание и игры.",
    documents: ["Паспорт питомца.pdf", "Сертификат вакцинации.pdf"],
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setReviews([...reviews, { id: Date.now(), user: "Новый пользователь", text: newReview }]);
    setNewReview("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{pet.name}</h2>
      <p className="text-gray-600 dark:text-gray-300">{pet.description}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800">
          <img src={pet.photo} alt={pet.name} className="w-full h-auto object-cover" />
        </div>

        <div className="space-y-2">
          <p><strong>Возраст:</strong> {pet.age}</p>
          <p><strong>Тип:</strong> {pet.type}</p>
          <p><strong>Порода:</strong> папа - {pet.breed.father}, мама - {pet.breed.mother}</p>
          <p><strong>Расцветка:</strong> {pet.color}</p>
          <p><strong>Дата рождения:</strong> {pet.birthDate}</p>
          <p><strong>Место рождения:</strong> {pet.birthPlace}</p>
          <p><strong>Текущее место проживания:</strong> {pet.currentPlace}</p>
          <p><strong>Прививки:</strong> {pet.vaccinations.join(", ")}</p>
          <p><strong>Здоровье:</strong> {pet.health}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Документы</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {pet.documents.map((doc, index) => (
            <li key={index}>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">{doc}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Отзывы</h3>
        <ul className="space-y-2">
          {reviews.map((rev) => (
            <li key={rev.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
              <p className="font-medium">{rev.user}</p>
              <p className="text-gray-700 dark:text-gray-300">{rev.text}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddReview} className="mt-2 flex flex-col gap-2">
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            placeholder="Оставьте отзыв о питомце"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            rows={3}
          />
          <button
            type="submit"
            className="self-start px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Добавить отзыв
          </button>
        </form>
      </div>
    </div>
  );
}
