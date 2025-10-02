import { Link } from "react-router-dom";

export default function Profile() {
  const owner = {
    name: "Анастасия",
    role: "Владелец / Любитель животных",
    description:
      "Я люблю своих питомцев и слежу за их здоровьем и активностью. Здесь показаны мои животные и их основные данные.",
    contact: {
      email: "anastasia@example.com",
      phone: "+7 777 123 45 67",
    },
  };

  const pets = [
    {
      id: 1,
      name: "Мия",
      age: "4 месяца",
      type: "Кошка",
      color: "Серо-белый с черными отметинами",
      photo: "https://placekitten.com/400/300",
      description: "Очень ласковая и игривая кошка, любит внимание и игры.",
      link: "/pets/1",
    },
    {
      id: 2,
      name: "Лютик",
      age: "2 года",
      type: "Кошка",
      color: "Черная с белым пятном на груди",
      photo: "https://placekitten.com/401/300",
      description: "Активный и любопытный кот, любит играть с игрушками и наблюдать за птицами.",
      link: "/pets/2",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{owner.name}</h2>
        <p className="text-gray-600 dark:text-gray-300">{owner.role}</p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">{owner.description}</p>
        <div className="mt-3 space-y-1 text-gray-700 dark:text-gray-300">
          <p><strong>Email:</strong> {owner.contact.email}</p>
          <p><strong>Телефон:</strong> {owner.contact.phone}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Мои питомцы</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              to={pet.link}
              className="block border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white dark:bg-gray-800"
            >
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{pet.name}</h4>
                <p className="text-gray-700 dark:text-gray-300">{pet.type}, {pet.age}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{pet.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
