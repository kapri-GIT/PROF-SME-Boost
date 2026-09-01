import Link from 'next/link'

const checks = [
  ['PASS', 'ИНН 10/12 цифр', 'Проверка формата до расчёта.'],
  ['PASS', 'Ложные данные', 'Mock-источник явно обозначен в отчёте.'],
  ['PARTIAL', 'Внешние API', 'Нужны Dadata/Checko/ФНС credentials; добавить timeout, retry и circuit breaker.'],
  ['PARTIAL', 'Правовая информация', 'Заполнить реквизиты оператора и утвердить документы.'],
  ['PARTIAL', 'Ролевой доступ', 'Проверить tenant scope в server action для каждого запроса.'],
]

export default function AuditPage() { return <main className="legal-wrap audit-page"><Link href="/">← Вернуться в панель</Link><p className="eyebrow">КОНТРОЛЬ КАЧЕСТВА</p><h1>Отчёт глубокого тестирования</h1><p className="muted">Проверка элементов, демо-данных, отказоустойчивости и требований к подключению.</p><div className="audit-list">{checks.map(([status, title, detail]) => <article key={title}><span className={`audit-status ${status.toLowerCase()}`}>{status}</span><div><h2>{title}</h2><p>{detail}</p></div></article>)}</div><section className="legal-warning"><strong>Как отличить реальные данные</strong><p>В каждом отчёте должен быть источник, дата обновления, ИНН и статус адаптера. Пока API не подключён, система не должна показывать карточку как данные ФНС.</p></section></main> }
