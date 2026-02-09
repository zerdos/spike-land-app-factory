export default function DoggoDashboard() {
  const today = new Date();

  const doggos = [
    {
      name: "Pixel",
      emoji: "🦮",
      breed: "British Creme Golden Retriever",
      color: "from-amber-100 to-yellow-200",
      accentColor: "amber",
      born: new Date("2024-07-26"),
      adopted: new Date("2024-10-25"),
    },
    {
      name: "Maxell",
      emoji: "🐕‍🦺",
      breed: "Black Goldador",
      color: "from-gray-700 to-gray-900",
      accentColor: "gray",
      born: new Date("2025-11-21"),
      adopted: new Date("2026-01-17"),
    },
  ];

  const calculateAge = (birthDate: Date) => {
    const diff = today.getTime() - birthDate.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    return { years, months, days, totalDays };
  };

  const calculateDogYears = (birthDate: Date) => {
    const age = calculateAge(birthDate);
    const totalYears = age.totalDays / 365;

    if (totalYears <= 1) {
      return (totalYears * 15).toFixed(1);
    } else if (totalYears <= 2) {
      return (15 + (totalYears - 1) * 9).toFixed(1);
    } else {
      return (15 + 9 + (totalYears - 2) * 7).toFixed(1);
    }
  };

  const calculateTimeWithUs = (adoptedDate: Date) => {
    const diff = today.getTime() - adoptedDate.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    return { years, months, days, totalDays };
  };

  const calculateTimeTogetherPercent = (born: Date, adopted: Date) => {
    const totalLife = today.getTime() - born.getTime();
    const timeWithUs = today.getTime() - adopted.getTime();
    return ((timeWithUs / totalLife) * 100).toFixed(1);
  };

  const laterAdoption = new Date(Math.max(doggos[0].adopted.getTime(), doggos[1].adopted.getTime()));
  const timeTogether = calculateTimeWithUs(laterAdoption);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Doggo Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Tracking our furry family members since day one
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Today: {today.toLocaleDateString("en-GB", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {doggos.map((dog) => {
            const age = calculateAge(dog.born);
            const dogYears = calculateDogYears(dog.born);
            const timeWithUs = calculateTimeWithUs(dog.adopted);
            const togetherPercent = calculateTimeTogetherPercent(dog.born, dog.adopted);

            return (
              <div
                key={dog.name}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300"
              >
                <div className={`bg-gradient-to-r ${dog.color} p-6 ${dog.name === 'Maxwell' ? 'text-white' : 'text-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                        {dog.emoji} {dog.name}
                      </h2>
                      <p className={`text-sm ${dog.name === 'Maxwell' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {dog.breed}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{dogYears}</div>
                      <div className={`text-xs ${dog.name === 'Maxwell' ? 'text-gray-300' : 'text-gray-600'}`}>dog years</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-800 font-semibold">Age</span>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{age.years}</div>
                        <div className="text-xs text-gray-500">years</div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{age.months}</div>
                        <div className="text-xs text-gray-500">months</div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{age.days}</div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-xs text-gray-500">
                      Born: {dog.born.toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-800 font-semibold">Time With Us</span>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{timeWithUs.years}</div>
                        <div className="text-xs text-gray-500">years</div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{timeWithUs.months}</div>
                        <div className="text-xs text-gray-500">months</div>
                      </div>
                      <div className="flex-1 bg-white rounded-lg p-2 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{timeWithUs.days}</div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-xs text-gray-500">
                      Adopted: {dog.adopted.toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-800 font-semibold">Life With Family</span>
                      <span className="text-purple-600 font-bold">{togetherPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                        style={{ width: `${togetherPercent}%` }}
                      />
                    </div>
                    <div className="text-center mt-2 text-xs text-gray-500">
                      {timeWithUs.totalDays} days of cuddles and adventures!
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Pack Statistics
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">🦴</div>
              <div className="text-2xl font-bold text-orange-600">{timeTogether.totalDays}</div>
              <div className="text-xs text-gray-600">Days as a Pack</div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">🎾</div>
              <div className="text-2xl font-bold text-blue-600">{(timeTogether.totalDays * 3).toLocaleString()}</div>
              <div className="text-xs text-gray-600">Estimated Walks</div>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">❤️</div>
              <div className="text-2xl font-bold text-red-600">{(timeTogether.totalDays * 100).toLocaleString()}</div>
              <div className="text-xs text-gray-600">Tail Wags (approx)</div>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-1">🍖</div>
              <div className="text-2xl font-bold text-green-600">{(timeTogether.totalDays * 4).toLocaleString()}</div>
              <div className="text-xs text-gray-600">Meals Served</div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 rounded-xl p-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700 mb-2">Combined Dog Years Experience</div>
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                {(parseFloat(calculateDogYears(doggos[0].born)) + parseFloat(calculateDogYears(doggos[1].born))).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500 mt-1">years of wisdom combined</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-400 text-sm">
          Made with love for Pixel and Maxwell
        </div>
      </div>
    </div>
  );
}