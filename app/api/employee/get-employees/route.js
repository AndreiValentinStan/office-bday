export async function GET(req) {
  const employees = [
    {
      id: 1,
      first_name: "Goraud",
      last_name: "Wavell",
      birth_date: "20.12.2024",
    },
    {
      id: 2,
      first_name: "Fabio",
      last_name: "Edgecumbe",
      birth_date: "19.09.2024",
    },
    {
      id: 3,
      first_name: "Adelheid",
      last_name: "Hellin",
      birth_date: "26.05.2023",
    },
    {
      id: 4,
      first_name: "Ewart",
      last_name: "Raynham",
      birth_date: "20.04.2024",
    },
    {
      id: 5,
      first_name: "Flin",
      last_name: "Annion",
      birth_date: "30.12.2024",
    },
    {
      id: 6,
      first_name: "Brittni",
      last_name: "Jancso",
      birth_date: "15.02.2024",
    },
    {
      id: 7,
      first_name: "Dewie",
      last_name: "Geake",
      birth_date: "16.04.2024",
    },
    {
      id: 8,
      first_name: "Alta",
      last_name: "Calcutt",
      birth_date: "25.07.2023",
    },
    {
      id: 9,
      first_name: "Moore",
      last_name: "Tidswell",
      birth_date: "30.11.2024",
    },
    {
      id: 10,
      first_name: "Olympia",
      last_name: "Kitman",
      birth_date: "12.07.2024",
    },
    {
      id: 11,
      first_name: "Nicoli",
      last_name: "Gilding",
      birth_date: "23.11.2024",
    },
    {
      id: 12,
      first_name: "Melisenda",
      last_name: "Kersaw",
      birth_date: "06.12.2023",
    },
    {
      id: 13,
      first_name: "Moreen",
      last_name: "Leppo",
      birth_date: "21.01.2024",
    },
    {
      id: 14,
      first_name: "Brandy",
      last_name: "Lemon",
      birth_date: "04.03.2023",
    },
    {
      id: 15,
      first_name: "Antone",
      last_name: "Scade",
      birth_date: "06.12.2024",
    },
    {
      id: 16,
      first_name: "Levin",
      last_name: "Dafydd",
      birth_date: "01.10.2023",
    },
    {
      id: 17,
      first_name: "Celisse",
      last_name: "Knowlden",
      birth_date: "23.05.2024",
    },
    {
      id: 18,
      first_name: "Tami",
      last_name: "Sharp",
      birth_date: "21.01.2023",
    },
    {
      id: 19,
      first_name: "Coralyn",
      last_name: "O'Nowlan",
      birth_date: "08.05.2023",
    },
    {
      id: 20,
      first_name: "Kelwin",
      last_name: "Lyes",
      birth_date: "25.01.2024",
    },
    {
      id: 21,
      first_name: "Eudora",
      last_name: "Dyble",
      birth_date: "16.02.2023",
    },
    {
      id: 22,
      first_name: "Nikolai",
      last_name: "Pactat",
      birth_date: "04.03.2023",
    },
    {
      id: 23,
      first_name: "Kara",
      last_name: "MacFadzean",
      birth_date: "05.11.2024",
    },
    {
      id: 24,
      first_name: "Lenci",
      last_name: "Roelofsen",
      birth_date: "02.06.2023",
    },
    {
      id: 25,
      first_name: "Marcelle",
      last_name: "Drackford",
      birth_date: "29.03.2024",
    },
    {
      id: 26,
      first_name: "Cori",
      last_name: "Origin",
      birth_date: "06.04.2023",
    },
    {
      id: 27,
      first_name: "Brittani",
      last_name: "Beamish",
      birth_date: "08.08.2024",
    },
    {
      id: 28,
      first_name: "Chris",
      last_name: "Bellie",
      birth_date: "10.11.2024",
    },
    {
      id: 29,
      first_name: "Durward",
      last_name: "Brownsell",
      birth_date: "01.08.2023",
    },
    {
      id: 30,
      first_name: "Neville",
      last_name: "Indruch",
      birth_date: "23.03.2023",
    },
    {
      id: 31,
      first_name: "Efren",
      last_name: "Gossage",
      birth_date: "05.03.2023",
    },
    {
      id: 32,
      first_name: "Chauncey",
      last_name: "Wooderson",
      birth_date: "24.07.2024",
    },
    {
      id: 33,
      first_name: "Biron",
      last_name: "MacRinn",
      birth_date: "06.06.2024",
    },
    {
      id: 34,
      first_name: "Yuma",
      last_name: "VanBrugh",
      birth_date: "20.06.2024",
    },
    {
      id: 35,
      first_name: "Cletus",
      last_name: "Divill",
      birth_date: "05.10.2024",
    },
    {
      id: 36,
      first_name: "Cinderella",
      last_name: "Gagg",
      birth_date: "23.03.2023",
    },
    {
      id: 37,
      first_name: "Moore",
      last_name: "Talton",
      birth_date: "21.11.2024",
    },
    {
      id: 38,
      first_name: "Pascal",
      last_name: "McPhillimey",
      birth_date: "29.04.2024",
    },
    {
      id: 39,
      first_name: "Nicolea",
      last_name: "Preddle",
      birth_date: "07.09.2024",
    },
    {
      id: 40,
      first_name: "Abeu",
      last_name: "Callam",
      birth_date: "30.08.2023",
    },
    {
      id: 41,
      first_name: "Lindsy",
      last_name: "Joselovitch",
      birth_date: "19.09.2024",
    },
    {
      id: 42,
      first_name: "Denna",
      last_name: "Pepi",
      birth_date: "20.01.2023",
    },
    {
      id: 43,
      first_name: "Ivar",
      last_name: "Cockburn",
      birth_date: "27.04.2024",
    },
    {
      id: 44,
      first_name: "Wilone",
      last_name: "Wortley",
      birth_date: "14.07.2023",
    },
    {
      id: 45,
      first_name: "Nonie",
      last_name: "Pensom",
      birth_date: "20.09.2024",
    },
    {
      id: 46,
      first_name: "Silvio",
      last_name: "Hablet",
      birth_date: "05.10.2024",
    },
    {
      id: 47,
      first_name: "Jerry",
      last_name: "Evins",
      birth_date: "09.06.2024",
    },
    {
      id: 48,
      first_name: "Gabby",
      last_name: "Radcliffe",
      birth_date: "18.03.2025",
    },
    {
      id: 49,
      first_name: "Bradley",
      last_name: "Farlham",
      birth_date: "19.07.2024",
    },
    {
      id: 50,
      first_name: "Rhoda",
      last_name: "Buxsy",
      birth_date: "13.11.2024",
    },
    {
      id: 51,
      first_name: "Nessy",
      last_name: "Burridge",
      birth_date: "07.07.2024",
    },
    {
      id: 52,
      first_name: "Ingaberg",
      last_name: "Fysh",
      birth_date: "15.11.2023",
    },
    {
      id: 53,
      first_name: "Ambrosius",
      last_name: "Bain",
      birth_date: "25.06.2024",
    },
    {
      id: 54,
      first_name: "Giacopo",
      last_name: "Fricker",
      birth_date: "06.03.2025",
    },
    {
      id: 55,
      first_name: "Denise",
      last_name: "Lambdon",
      birth_date: "30.09.2023",
    },
    {
      id: 56,
      first_name: "Zed",
      last_name: "Burness",
      birth_date: "22.04.2024",
    },
    {
      id: 57,
      first_name: "Aila",
      last_name: "Spuffard",
      birth_date: "03.02.2023",
    },
    {
      id: 58,
      first_name: "Rozalie",
      last_name: "Beveridge",
      birth_date: "02.01.2023",
    },
    {
      id: 59,
      first_name: "Leora",
      last_name: "Row",
      birth_date: "06.04.2023",
    },
    {
      id: 60,
      first_name: "Costanza",
      last_name: "Skilbeck",
      birth_date: "30.09.2023",
    },
    {
      id: 61,
      first_name: "Penrod",
      last_name: "Sowden",
      birth_date: "23.10.2024",
    },
    {
      id: 62,
      first_name: "Cthrine",
      last_name: "Romao",
      birth_date: "26.06.2024",
    },
    {
      id: 63,
      first_name: "Hyacinthie",
      last_name: "Hearse",
      birth_date: "24.11.2024",
    },
    {
      id: 64,
      first_name: "Kirstyn",
      last_name: "Byrnes",
      birth_date: "19.01.2025",
    },
    {
      id: 65,
      first_name: "Allyson",
      last_name: "Pattisson",
      birth_date: "11.02.2023",
    },
    {
      id: 66,
      first_name: "Merell",
      last_name: "Beels",
      birth_date: "08.08.2023",
    },
    {
      id: 67,
      first_name: "Meredith",
      last_name: "McFater",
      birth_date: "24.02.2025",
    },
    {
      id: 68,
      first_name: "Julio",
      last_name: "MacAllester",
      birth_date: "16.07.2023",
    },
    {
      id: 69,
      first_name: "Keely",
      last_name: "Diter",
      birth_date: "30.12.2023",
    },
    {
      id: 70,
      first_name: "Patrizia",
      last_name: "Cluer",
      birth_date: "01.06.2024",
    },
    {
      id: 71,
      first_name: "Aurel",
      last_name: "Croce",
      birth_date: "06.05.2023",
    },
    {
      id: 72,
      first_name: "Kissiah",
      last_name: "Bonar",
      birth_date: "28.03.2023",
    },
    {
      id: 73,
      first_name: "Rickie",
      last_name: "Senett",
      birth_date: "19.08.2024",
    },
    {
      id: 74,
      first_name: "Tallou",
      last_name: "Pursglove",
      birth_date: "04.10.2023",
    },
    {
      id: 75,
      first_name: "Prudy",
      last_name: "Ludron",
      birth_date: "22.05.2024",
    },
    {
      id: 76,
      first_name: "Haleigh",
      last_name: "Mallen",
      birth_date: "12.09.2024",
    },
    {
      id: 77,
      first_name: "Padgett",
      last_name: "Hatch",
      birth_date: "12.12.2023",
    },
    {
      id: 78,
      first_name: "Mylo",
      last_name: "Youthed",
      birth_date: "04.03.2023",
    },
    {
      id: 79,
      first_name: "Lulu",
      last_name: "Wareham",
      birth_date: "04.05.2024",
    },
    {
      id: 80,
      first_name: "Rheta",
      last_name: "Hauger",
      birth_date: "24.04.2023",
    },
    {
      id: 81,
      first_name: "Bettine",
      last_name: "Greenman",
      birth_date: "07.11.2024",
    },
    {
      id: 82,
      first_name: "Sayer",
      last_name: "Germain",
      birth_date: "22.06.2023",
    },
    {
      id: 83,
      first_name: "Xerxes",
      last_name: "Eveleigh",
      birth_date: "04.01.2024",
    },
    {
      id: 84,
      first_name: "Keri",
      last_name: "Auton",
      birth_date: "30.09.2023",
    },
    {
      id: 85,
      first_name: "Carleen",
      last_name: "Teaser",
      birth_date: "06.09.2024",
    },
    {
      id: 86,
      first_name: "Paige",
      last_name: "Bluett",
      birth_date: "28.12.2024",
    },
    {
      id: 87,
      first_name: "Orelee",
      last_name: "Worrall",
      birth_date: "15.05.2023",
    },
    {
      id: 88,
      first_name: "Dannel",
      last_name: "Creebo",
      birth_date: "28.02.2024",
    },
    {
      id: 89,
      first_name: "Rutledge",
      last_name: "Huckett",
      birth_date: "30.04.2023",
    },
    {
      id: 90,
      first_name: "Yehudi",
      last_name: "Peyes",
      birth_date: "12.01.2023",
    },
    {
      id: 91,
      first_name: "Merrie",
      last_name: "Rawls",
      birth_date: "11.02.2024",
    },
    {
      id: 92,
      first_name: "Edvard",
      last_name: "Snazel",
      birth_date: "29.11.2024",
    },
    {
      id: 93,
      first_name: "Rustie",
      last_name: "Persicke",
      birth_date: "06.01.2025",
    },
    {
      id: 94,
      first_name: "Debora",
      last_name: "Ventam",
      birth_date: "08.03.2023",
    },
    {
      id: 95,
      first_name: "Augustin",
      last_name: "Gurden",
      birth_date: "22.12.2023",
    },
    {
      id: 96,
      first_name: "Dredi",
      last_name: "Tripean",
      birth_date: "04.01.2023",
    },
    {
      id: 97,
      first_name: "Alistair",
      last_name: "Gammade",
      birth_date: "27.11.2023",
    },
    {
      id: 98,
      first_name: "Rae",
      last_name: "Biggans",
      birth_date: "09.06.2023",
    },
    {
      id: 99,
      first_name: "Marcile",
      last_name: "Driutti",
      birth_date: "02.09.2023",
    },
    {
      id: 100,
      first_name: "Matthaeus",
      last_name: "Denge",
      birth_date: "08.07.2023",
    },
  ];

  const params = req.nextUrl.searchParams;
  let count = params.get("count");
  if (!count) count = 20;

  await new Promise((res) => {
    setTimeout(() => {
      return res();
    }, 2000);
  });

  console.log({ fName: params.get("first_name") });

  if (params.get("firstName")) {
    const first_name = params.get("firstName");
    const data = employees.filter(
      (employee) => employee.first_name.toLocaleLowerCase().includes(first_name.toLowerCase())
    );
   
    return Response.json({
      count: 0,
      employees: data,
    });
  }

  return Response.json({ count: 0, employees: employees.slice(0, count) });
}
