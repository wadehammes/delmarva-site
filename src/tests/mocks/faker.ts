const sequence = { email: 0, lorem: 0, uuid: 0 };

export const faker = {
  helpers: {
    arrayElement: <T>(items: readonly T[]): T => items[0],
  },
  internet: {
    email: () => {
      sequence.email += 1;
      return `test-user-${sequence.email}@example.com`;
    },
  },
  lorem: {
    paragraph: () => {
      sequence.lorem += 1;
      return `Test paragraph ${sequence.lorem}.`;
    },
    sentence: () => {
      sequence.lorem += 1;
      return `Test sentence ${sequence.lorem}.`;
    },
  },
  string: {
    uuid: () => {
      sequence.uuid += 1;
      return `00000000-0000-4000-8000-${String(sequence.uuid).padStart(12, "0")}`;
    },
  },
};
