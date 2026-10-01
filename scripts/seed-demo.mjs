/**
 * Genera datos de demo para una cuenta de desarrollo.
 *
 *   pnpm seed:demo --latest                  # usa la última cuenta que entró a la app
 *   pnpm seed:demo <clerkUserId>             # borra y siembra de cero
 *   pnpm seed:demo <clerkUserId> --keep      # conserva las métricas existentes
 *   pnpm seed:demo <clerkUserId> --dry-run   # solo imprime el resumen
 *
 * El userId es el id de Clerk de la cuenta con la que harás la demo
 * (Clerk Dashboard > Users, o el claim `sub` de la sesión). Con --latest se
 * resuelve solo: coge la fila más reciente de user_preferences, que la app
 * crea al entrar por primera vez al dashboard.
 *
 * Los valores son deterministas: ejecutarlo dos veces da el mismo dataset.
 */

import { neon } from "@neondatabase/serverless";

const HISTORY_DAYS = 548; // ~18 meses
const TIME_ZONE = "Europe/Madrid";
const RANDOM_SEED = 20261001;

const args = process.argv.slice(2);
const keepExisting = args.includes("--keep");
const dryRun = args.includes("--dry-run");
const useLatestUser = args.includes("--latest");
const explicitUserId = args.find((arg) => !arg.startsWith("--"));

if (!explicitUserId && !useLatestUser && !dryRun) {
  console.error(
    "Falta el id de usuario de Clerk.\n" +
      "Uso: pnpm seed:demo user_xxxxxxxxxxxxxxxxxxxxxxxxxxx [--keep]\n" +
      "     pnpm seed:demo --latest   (última cuenta que entró a la app)",
  );
  process.exit(1);
}

if (explicitUserId && !explicitUserId.startsWith("user_")) {
  console.error(`"${explicitUserId}" no parece un id de Clerk (user_...).`);
  process.exit(1);
}

if (!process.env.DATABASE_URL && !dryRun) {
  console.error(
    "DATABASE_URL no está definida (¿falta --env-file=.env.local?)",
  );
  process.exit(1);
}

const sql = dryRun ? null : neon(process.env.DATABASE_URL);

/* ------------------------------------------------------------------ utils */

function createRandom(seed) {
  let state = seed >>> 0;

  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(RANDOM_SEED);

function noise(amplitude) {
  return (random() * 2 - 1) * amplitude;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function toCalendarDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildCalendar(days) {
  const today = new Date();
  const end = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(end - (days - 1 - index) * 86_400_000);

    return {
      date: toCalendarDate(date),
      dayOfWeek: date.getUTCDay(), // 0 domingo … 6 sábado
      isWeekend: date.getUTCDay() === 0 || date.getUTCDay() === 6,
      progress: days === 1 ? 1 : index / (days - 1),
      index,
    };
  });
}

const calendar = buildCalendar(HISTORY_DAYS);
const todayDate = calendar[calendar.length - 1].date;

// Una semana de vacaciones sin registrar hábitos de casa.
const tripStart = calendar[Math.floor(HISTORY_DAYS * 0.42)].date;
const tripEnd = calendar[Math.floor(HISTORY_DAYS * 0.42) + 6].date;
const isTrip = (day) => day.date >= tripStart && day.date <= tripEnd;

/* ---------------------------------------------------------------- métricas */

const metricDefinitions = [
  {
    name: "Peso corporal",
    description: "Primera hora de la mañana, en ayunas",
    unitSymbol: "kg",
    decimals: 1,
    // Bajada progresiva de 84 a 76 kg con oscilación semanal.
    frequency: 0.86,
    skip: isTrip,
    logsToday: true,
    value: (day) =>
      clamp(
        84 -
          8 * easeInOut(day.progress) +
          0.45 * Math.sin((day.index / 7) * Math.PI * 2) +
          noise(0.35),
        70,
        90,
      ),
  },
  {
    name: "Horas de sueño",
    description: "De la hora de acostarse a la de despertarse",
    unitSymbol: "h",
    decimals: 1,
    frequency: 0.9,
    logsToday: true,
    value: (day) =>
      clamp(
        (day.isWeekend ? 7.9 : 6.8) + 0.6 * day.progress + noise(0.85),
        4.2,
        9.8,
      ),
  },
  {
    name: "Pasos",
    description: "Contados por el móvil",
    unitSymbol: "stp",
    decimals: 0,
    step: 10,
    frequency: 0.95,
    logsToday: false,
    value: (day) =>
      clamp(
        (day.isWeekend ? 11500 : 8200) + 1800 * day.progress + noise(2600),
        1200,
        22000,
      ),
  },
  {
    name: "Cigarrillos",
    description: "Objetivo: llegar a cero",
    unitSymbol: "cnt",
    decimals: 0,
    frequency: 0.97,
    logsToday: true,
    // Baja de 14 al día hasta dejarlo en el último 15% del periodo.
    value: (day) =>
      Math.max(
        0,
        Math.round(14 * (1 - Math.min(1, day.progress / 0.85)) + noise(1.4)),
      ),
  },
  {
    name: "Vasos de agua",
    description: "Vasos de 250 ml",
    unitSymbol: "u",
    decimals: 0,
    frequency: 0.88,
    skip: isTrip,
    logsToday: true,
    value: (day) => clamp(6 + 1.8 * day.progress + noise(2.2), 2, 12),
  },
  {
    name: "Gasto diario",
    description: "Gasto total del día, sin recibos fijos",
    unitSymbol: "EUR",
    decimals: 2,
    frequency: 0.92,
    logsToday: false,
    value: (day) => {
      const base = (day.isWeekend ? 34 : 17) + noise(11);
      const bigPurchase = random() < 0.08 ? 55 + random() * 70 : 0;
      return clamp(base + bigPurchase, 0, 260);
    },
  },
];

function buildEntries(metric) {
  const entries = [];

  for (const day of calendar) {
    const isToday = day.date === todayDate;

    if (isToday && !metric.logsToday) continue;
    if (!isToday) {
      if (metric.skip?.(day)) continue;
      if (random() > metric.frequency) continue;
    }

    let value = round(metric.value(day), metric.decimals);

    if (metric.step) {
      value = Math.round(value / metric.step) * metric.step;
    }

    entries.push({ date: day.date, value });
  }

  return entries;
}

/* -------------------------------------------------------------------- seed */

async function resolveUserId() {
  if (explicitUserId) {
    return explicitUserId;
  }

  const [latest] = await sql`
    select user_id from user_preferences order by created_at desc limit 1
  `;

  if (!latest) {
    throw new Error(
      "No hay ninguna cuenta en user_preferences. Entra una vez al dashboard " +
        "con la cuenta de demo y vuelve a ejecutar el seed.",
    );
  }

  console.log(`Cuenta de demo: ${latest.user_id} (la más reciente)`);

  // --latest es una conjetura: si esa cuenta ya tiene datos, no los borramos
  // a ciegas por si ha resuelto a una cuenta real.
  if (!keepExisting) {
    const [{ count }] = await sql`
      select count(*)::int as count from metrics where user_id = ${latest.user_id}
    `;

    if (count > 0) {
      throw new Error(
        `${latest.user_id} ya tiene ${count} métricas. Pasa el id explícito ` +
          "para borrarlas, o usa --keep para conservarlas.",
      );
    }
  }

  return latest.user_id;
}

async function main() {
  if (dryRun) {
    return dryRunReport();
  }

  const userId = await resolveUserId();
  const unitRows = await sql`select id, symbol from units`;
  const unitIdBySymbol = new Map(unitRows.map((row) => [row.symbol, row.id]));

  const missingUnits = metricDefinitions
    .map((metric) => metric.unitSymbol)
    .filter((symbol) => !unitIdBySymbol.has(symbol));

  if (missingUnits.length) {
    throw new Error(
      `Faltan unidades en la tabla units: ${missingUnits.join(", ")}`,
    );
  }

  if (!keepExisting) {
    const removed = await sql`
      delete from metrics where user_id = ${userId} returning id
    `;
    await sql`delete from entries where user_id = ${userId}`;
    console.log(`Borradas ${removed.length} métricas previas de ${userId}`);
  }

  await sql`
    insert into user_preferences (user_id, time_zone)
    values (${userId}, ${TIME_ZONE})
    on conflict (user_id) do update set
      time_zone = excluded.time_zone,
      updated_at = now()
  `;

  let totalEntries = 0;

  for (const metric of metricDefinitions) {
    const [existing] = keepExisting
      ? await sql`
          select id from metrics
          where user_id = ${userId} and name = ${metric.name}
          limit 1
        `
      : [];

    const [{ id: metricId }] = existing
      ? [existing]
      : await sql`
          insert into metrics (user_id, name, description, unit_id)
          values (
            ${userId},
            ${metric.name},
            ${metric.description},
            ${unitIdBySymbol.get(metric.unitSymbol)}
          )
          returning id
        `;

    const entries = buildEntries(metric);
    const dates = entries.map((entry) => entry.date);
    const values = entries.map((entry) => String(entry.value));

    await sql`
      insert into entries (metric_id, user_id, value, date)
      select ${metricId}::uuid, ${userId}::text, entry.value, entry.date
      from unnest(${values}::numeric[], ${dates}::date[]) as entry(value, date)
      on conflict (metric_id, date) do update set value = excluded.value
    `;

    totalEntries += entries.length;

    const last = entries[entries.length - 1];
    console.log(
      `${metric.name.padEnd(18)} ${String(entries.length).padStart(4)} entradas` +
        `  última: ${last.date} = ${last.value} ${metric.unitSymbol}`,
    );
  }

  console.log(
    `\nListo: ${metricDefinitions.length} métricas y ${totalEntries} entradas ` +
      `entre ${calendar[0].date} y ${todayDate}.`,
  );
}

function dryRunReport() {
  let totalEntries = 0;

  for (const metric of metricDefinitions) {
    const entries = buildEntries(metric);
    const values = entries.map((entry) => entry.value);
    const last = entries[entries.length - 1];

    totalEntries += entries.length;

    console.log(
      `${metric.name.padEnd(18)} ${String(entries.length).padStart(4)} entradas` +
        `  min ${Math.min(...values)}  max ${Math.max(...values)}` +
        `  última ${last.date} = ${last.value} ${metric.unitSymbol}`,
    );
  }

  console.log(
    `\nDry run: ${metricDefinitions.length} métricas y ${totalEntries} entradas ` +
      `entre ${calendar[0].date} y ${todayDate}. Vacaciones sin registro: ${tripStart} → ${tripEnd}.`,
  );
}

main().catch((error) => {
  console.error("\nEl seed ha fallado:", error);
  process.exit(1);
});
