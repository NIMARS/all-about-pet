import { Link } from "react-router-dom";

export default function Blog() {
  // Пример данных статей
  const articles = [
    {
      id: 1,
      title: "Как правильно кормить кошку",
      description:
        "Краткое описание статьи о правильном питании кошек: какие продукты полезны, что лучше избегать, советы по режиму кормления.",
      link: "/blog",
    },
    {
      id: 2,
      title: "Выбор игрушек для щенков",
      description:
        "Основные советы по выбору безопасных и интересных игрушек для щенков, чтобы развивать интеллект и поддерживать активность.",
      link: "/blog",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Блог о питомцах
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Здесь вы найдете полезные статьи о питомцах, их питании, уходе и развлечениях.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 bg-white dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {article.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {article.description}
            </p>
            <Link
              to={article.link}
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline transition-colors duration-200"
            >
              Читать далее →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
