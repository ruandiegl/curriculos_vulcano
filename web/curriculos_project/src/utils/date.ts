export function calculateAge(dateValue: string) {
  const birthDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

export function isAtLeastAge(dateValue: string, minimumAge: number) {
  const age = calculateAge(dateValue);

  return age !== null && age >= minimumAge;
}
