import { IdentifiedPhrase, PhraseType, CEFRLevel } from '../types';

// Built-in English -> Indonesian dictionary with grammar categorization and IPA
export const BUILTIN_DICTIONARY: Record<string, {
  translation: string;
  phraseType: PhraseType;
  level: CEFRLevel;
  ipa?: string;
  explanation?: string;
}> = {
  // Connectors and discourse markers
  'however': { translation: 'namun / akan tetapi', phraseType: 'connector', level: 'A2', ipa: '/haʊˈev.ər/' },
  'therefore': { translation: 'oleh karena itu', phraseType: 'connector', level: 'B1', ipa: '/ˈðeə.fɔːr/' },
  'furthermore': { translation: 'selain itu / lebih jauh lagi', phraseType: 'connector', level: 'B2', ipa: '/ˌfɜː.ðəˈmɔːr/' },
  'moreover': { translation: 'terlebih lagi / lagipula', phraseType: 'connector', level: 'B2', ipa: '/mɔːrˈoʊ.vər/' },
  'in addition': { translation: 'sebagai tambahan', phraseType: 'connector', level: 'B1' },
  'in conclusion': { translation: 'kesimpulannya', phraseType: 'connector', level: 'B1' },
  'on the other hand': { translation: 'di sisi lain', phraseType: 'connector', level: 'B1' },
  'as a result': { translation: 'sebagai akibatnya / hasilnya', phraseType: 'connector', level: 'B1' },
  'for example': { translation: 'sebagai contoh', phraseType: 'connector', level: 'A1' },
  'for instance': { translation: 'misalnya', phraseType: 'connector', level: 'A2' },
  'in contrast': { translation: 'sebaliknya', phraseType: 'connector', level: 'B2' },
  'nevertheless': { translation: 'meskipun demikian', phraseType: 'connector', level: 'B2' },
  'meanwhile': { translation: 'sementara itu', phraseType: 'connector', level: 'B1' },
  'first of all': { translation: 'pertama-tama', phraseType: 'connector', level: 'A2' },
  'in particular': { translation: 'khususnya', phraseType: 'connector', level: 'B1' },
  'in other words': { translation: 'dengan kata lain', phraseType: 'connector', level: 'B1' },
  'to begin with': { translation: 'sebagai permulaan', phraseType: 'connector', level: 'B1' },
  'in summary': { translation: 'secara ringkas', phraseType: 'connector', level: 'B1' },
  'finally': { translation: 'akhirnya', phraseType: 'connector', level: 'A2' },

  // Prepositional phrases
  'according to': { translation: 'menurut / berdasarkan', phraseType: 'preposition', level: 'B1' },
  'in front of': { translation: 'di depan', phraseType: 'preposition', level: 'A1' },
  'because of': { translation: 'karena / disebabkan oleh', phraseType: 'preposition', level: 'A2' },
  'due to': { translation: 'karena / akibat dari', phraseType: 'preposition', level: 'B1' },
  'instead of': { translation: 'daripada / alih-alih', phraseType: 'preposition', level: 'B1' },
  'in spite of': { translation: 'meskipun / terlepas dari', phraseType: 'preposition', level: 'B2' },
  'as well as': { translation: 'serta / begitu pula', phraseType: 'preposition', level: 'B1' },
  'next to': { translation: 'di sebelah / di samping', phraseType: 'preposition', level: 'A1' },
  'close to': { translation: 'dekat dengan', phraseType: 'preposition', level: 'A2' },
  'at the end of': { translation: 'di akhir dari', phraseType: 'preposition', level: 'A2' },
  'near the stairs': { translation: 'di dekat tangga', phraseType: 'preposition', level: 'A1' },
  'above the library': { translation: 'di atas perpustakaan', phraseType: 'preposition', level: 'A1' },
  'beside the science room': { translation: 'di samping ruang sains', phraseType: 'preposition', level: 'A2' },
  'during afternoon recess': { translation: 'saat istirahat siang', phraseType: 'preposition', level: 'B1' },
  'in terms of': { translation: 'dalam hal', phraseType: 'preposition', level: 'B2' },
  'with regard to': { translation: 'berkenaan dengan', phraseType: 'preposition', level: 'B2' },
  'such as': { translation: 'seperti halnya / contohnya', phraseType: 'preposition', level: 'A2' },
  'along with': { translation: 'bersamaan dengan', phraseType: 'preposition', level: 'B1' },
  'prior to': { translation: 'sebelum / menjelang', phraseType: 'preposition', level: 'B2' },
  'thanks to': { translation: 'berkat', phraseType: 'preposition', level: 'B1' },
  'based on': { translation: 'berdasarkan pada', phraseType: 'preposition', level: 'B1' },
  'in order to': { translation: 'agar / untuk', phraseType: 'preposition', level: 'A2' },

  // Common Verb Phrases & Phrasal Verbs
  'take place': { translation: 'berlangsung / terjadi', phraseType: 'verb_phrase', level: 'B1' },
  'takes place': { translation: 'berlangsung / terjadi', phraseType: 'verb_phrase', level: 'B1' },
  'took place': { translation: 'berlangsung / terjadi (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'carry out': { translation: 'melaksanakan / menjalankan', phraseType: 'verb_phrase', level: 'B1' },
  'carries out': { translation: 'melaksanakan / menjalankan', phraseType: 'verb_phrase', level: 'B1' },
  'carried out': { translation: 'melaksanakan / menjalankan (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'focus on': { translation: 'berfokus pada', phraseType: 'verb_phrase', level: 'A2' },
  'focuses on': { translation: 'berfokus pada', phraseType: 'verb_phrase', level: 'A2' },
  'focused on': { translation: 'berfokus pada (lampau)', phraseType: 'verb_phrase', level: 'A2' },
  'depend on': { translation: 'bergantung pada', phraseType: 'verb_phrase', level: 'A2' },
  'depends on': { translation: 'bergantung pada', phraseType: 'verb_phrase', level: 'A2' },
  'clean up': { translation: 'membersihkan', phraseType: 'verb_phrase', level: 'A1' },
  'cleans up': { translation: 'membersihkan', phraseType: 'verb_phrase', level: 'A1' },
  'cleaned up': { translation: 'membersihkan (lampau)', phraseType: 'verb_phrase', level: 'A1' },
  'look after': { translation: 'merawat / menjaga', phraseType: 'verb_phrase', level: 'A2' },
  'looks after': { translation: 'merawat / menjaga', phraseType: 'verb_phrase', level: 'A2' },
  'looked after': { translation: 'merawat / menjaga (lampau)', phraseType: 'verb_phrase', level: 'A2' },
  'bring about': { translation: 'menyebabkan / mendatangkan', phraseType: 'verb_phrase', level: 'B2' },
  'lead to': { translation: 'menyebabkan / mengarah ke', phraseType: 'verb_phrase', level: 'B1' },
  'leads to': { translation: 'menyebabkan / mengarah ke', phraseType: 'verb_phrase', level: 'B1' },
  'led to': { translation: 'menyebabkan / mengarah ke (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'contribute to': { translation: 'berkontribusi pada', phraseType: 'verb_phrase', level: 'B2' },
  'break down': { translation: 'rusak / mengurai', phraseType: 'verb_phrase', level: 'B1' },
  'breaks down': { translation: 'rusak / mengurai', phraseType: 'verb_phrase', level: 'B1' },
  'broke down': { translation: 'rusak / mengurai (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'deal with': { translation: 'menangani / menghadapi', phraseType: 'verb_phrase', level: 'B1' },
  'deals with': { translation: 'menangani / menghadapi', phraseType: 'verb_phrase', level: 'B1' },
  'participate in': { translation: 'berpartisipasi dalam', phraseType: 'verb_phrase', level: 'B1' },
  'participates in': { translation: 'berpartisipasi dalam', phraseType: 'verb_phrase', level: 'B1' },
  'participated in': { translation: 'berpartisipasi dalam (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'find out': { translation: 'mencari tahu / menemukan', phraseType: 'verb_phrase', level: 'A2' },
  'found out': { translation: 'menemukan / mengetahui (lampau)', phraseType: 'verb_phrase', level: 'A2' },
  'give up': { translation: 'menyerah', phraseType: 'verb_phrase', level: 'A2' },
  'gave up': { translation: 'menyerah (lampau)', phraseType: 'verb_phrase', level: 'A2' },
  'set up': { translation: 'mendirikan / menyiapkan', phraseType: 'verb_phrase', level: 'A2' },
  'point out': { translation: 'menunjukkan / menegaskan', phraseType: 'verb_phrase', level: 'B1' },
  'pointed out': { translation: 'menunjukkan / menegaskan (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'turn into': { translation: 'berubah menjadi', phraseType: 'verb_phrase', level: 'B1' },
  'turns into': { translation: 'berubah menjadi', phraseType: 'verb_phrase', level: 'B1' },
  'turned into': { translation: 'berubah menjadi (lampau)', phraseType: 'verb_phrase', level: 'B1' },
  'spend time': { translation: 'menghabiskan waktu', phraseType: 'verb_phrase', level: 'A2' },
  'spends time': { translation: 'menghabiskan waktu', phraseType: 'verb_phrase', level: 'A2' },
  'spent time': { translation: 'menghabiskan waktu (lampau)', phraseType: 'verb_phrase', level: 'A2' },
  'spend many hours': { translation: 'menghabiskan banyak jam', phraseType: 'verb_phrase', level: 'A2' },
  'make sure': { translation: 'memastikan', phraseType: 'verb_phrase', level: 'A2' },
  'play a role': { translation: 'memainkan peran penting', phraseType: 'verb_phrase', level: 'B2' },
  'plays a role': { translation: 'memainkan peran penting', phraseType: 'verb_phrase', level: 'B2' },
  'pay attention': { translation: 'memperhatikan', phraseType: 'verb_phrase', level: 'A2' },
  'pays attention': { translation: 'memperhatikan', phraseType: 'verb_phrase', level: 'A2' },
  'check the plants': { translation: 'memeriksa tanaman', phraseType: 'verb_phrase', level: 'A2' },
  'fill the watering cans': { translation: 'mengisi kaleng penyiram', phraseType: 'verb_phrase', level: 'A2' },
  'sweep the floor': { translation: 'menyapu lantai', phraseType: 'verb_phrase', level: 'A2' },
  'cover the floor': { translation: 'menutupi lantai', phraseType: 'verb_phrase', level: 'A2' },
  'focus much better': { translation: 'fokus jauh lebih baik', phraseType: 'verb_phrase', level: 'B1' },
  'stays fresh': { translation: 'tetap segar', phraseType: 'verb_phrase', level: 'A2' },

  // Common Noun Phrases & Compound Nouns
  'climate change': { translation: 'perubahan iklim', phraseType: 'noun_phrase', level: 'B1', ipa: '/ˈklaɪ.mət tʃeɪndʒ/' },
  'global warming': { translation: 'pemanasan global', phraseType: 'noun_phrase', level: 'B1' },
  'renewable energy': { translation: 'energi terbarukan', phraseType: 'noun_phrase', level: 'B2' },
  'solar energy': { translation: 'energi matahari', phraseType: 'noun_phrase', level: 'B1' },
  'artificial intelligence': { translation: 'kecerdasan buatan (AI)', phraseType: 'noun_phrase', level: 'B2' },
  'social media': { translation: 'media sosial', phraseType: 'noun_phrase', level: 'A2' },
  'daily life': { translation: 'kehidupan sehari-hari', phraseType: 'noun_phrase', level: 'A2' },
  'daily routine': { translation: 'rutinitas harian', phraseType: 'noun_phrase', level: 'A2' },
  'high school': { translation: 'sekolah menengah atas', phraseType: 'noun_phrase', level: 'A1' },
  'elementary school': { translation: 'sekolah dasar', phraseType: 'noun_phrase', level: 'A1' },
  'learning process': { translation: 'proses pembelajaran', phraseType: 'noun_phrase', level: 'B1' },
  'important factor': { translation: 'faktor penting', phraseType: 'noun_phrase', level: 'B1' },
  'great success': { translation: 'keberhasilan besar', phraseType: 'noun_phrase', level: 'A2' },
  'huge difference': { translation: 'perbedaan besar', phraseType: 'noun_phrase', level: 'A2' },
  'shared environment': { translation: 'lingkungan bersama', phraseType: 'noun_phrase', level: 'B1' },
  'clean-up team': { translation: 'tim kebersihan', phraseType: 'noun_phrase', level: 'A2', ipa: '/ˈkliːn.ʌp tiːm/' },
  'rooftop garden': { translation: 'taman atap gedung', phraseType: 'noun_phrase', level: 'A2', ipa: '/ˈruːf.tɒp ˈɡɑː.dən/' },
  'small rooftop garden': { translation: 'taman atap yang kecil', phraseType: 'noun_phrase', level: 'A2' },
  'student volunteers': { translation: 'sukarelawan murid', phraseType: 'noun_phrase', level: 'B1' },
  'student teams': { translation: 'tim murid', phraseType: 'noun_phrase', level: 'A2' },
  'peaceful green corner': { translation: 'sudut hijau yang damai', phraseType: 'noun_phrase', level: 'B1' },
  'peaceful corner': { translation: 'sudut yang damai', phraseType: 'noun_phrase', level: 'B1' },
  'scientific research': { translation: 'penelitian ilmiah', phraseType: 'noun_phrase', level: 'B2' },
  'natural environment': { translation: 'lingkungan alam', phraseType: 'noun_phrase', level: 'B1' },
  'narrow stairway': { translation: 'tangga sempit', phraseType: 'noun_phrase', level: 'B1' },
  'wooden door': { translation: 'pintu kayu', phraseType: 'noun_phrase', level: 'A2' },
  'third floor': { translation: 'lantai tiga', phraseType: 'noun_phrase', level: 'A1' },
  'watering cans': { translation: 'kaleng penyiram air', phraseType: 'noun_phrase', level: 'A2' },
  'wooden boxes': { translation: 'kotak kayu', phraseType: 'noun_phrase', level: 'A2' },
  'green plants': { translation: 'tanaman hijau', phraseType: 'noun_phrase', level: 'A1' },
  'simple labels': { translation: 'label sederhana', phraseType: 'noun_phrase', level: 'A2' },
  'fresh mint': { translation: 'daun mint segar', phraseType: 'noun_phrase', level: 'A2' },
  'cooking club': { translation: 'klub memasak', phraseType: 'noun_phrase', level: 'A2' },
  'small pots': { translation: 'pot-pot kecil', phraseType: 'noun_phrase', level: 'A2' },
  'blue bench': { translation: 'bangku biru', phraseType: 'noun_phrase', level: 'A1' },
  'quiet place': { translation: 'tempat yang tenang', phraseType: 'noun_phrase', level: 'A2' },
  'sports field': { translation: 'lapangan olahraga', phraseType: 'noun_phrase', level: 'A2' },
  'tall trees': { translation: 'pohon-pohon tinggi', phraseType: 'noun_phrase', level: 'A1' },
  'many friends': { translation: 'banyak teman', phraseType: 'noun_phrase', level: 'A1' },
  'cool air': { translation: 'udara sejuk', phraseType: 'noun_phrase', level: 'A2' },
  'soft shade': { translation: 'teduh yang nyaman', phraseType: 'noun_phrase', level: 'B1' },
  'rainy mornings': { translation: 'pagi hari yang hujan', phraseType: 'noun_phrase', level: 'A2' },
  'glass door': { translation: 'pintu kaca', phraseType: 'noun_phrase', level: 'A2' },
  'wet garden': { translation: 'taman yang basah', phraseType: 'noun_phrase', level: 'A1' },
  'science teacher': { translation: 'guru sains / IPA', phraseType: 'noun_phrase', level: 'A2' },
  'science room': { translation: 'ruang sains / laboratorium', phraseType: 'noun_phrase', level: 'A2' },
  'soil and insects': { translation: 'tanah dan serangga', phraseType: 'noun_phrase', level: 'B1' },
  'dry leaves': { translation: 'daun-daun kering', phraseType: 'noun_phrase', level: 'A2' },
  'compost bag': { translation: 'kantong kompos', phraseType: 'noun_phrase', level: 'B1' },
  'tool shelf': { translation: 'rak perkakas', phraseType: 'noun_phrase', level: 'B1' },
  'school year': { translation: 'tahun ajaran sekolah', phraseType: 'noun_phrase', level: 'A2' },
  'secret room': { translation: 'ruangan rahasia', phraseType: 'noun_phrase', level: 'A2' },
  'noisy school': { translation: 'sekolah yang bising', phraseType: 'noun_phrase', level: 'A2' },
  'pencil shavings': { translation: 'serutan pensil', phraseType: 'noun_phrase', level: 'B1' },
  'tidy desk': { translation: 'meja yang rapi', phraseType: 'noun_phrase', level: 'A2' },
  'calm atmosphere': { translation: 'suasana yang tenang', phraseType: 'noun_phrase', level: 'B1' },
  'team cooperation': { translation: 'kerjasama tim', phraseType: 'noun_phrase', level: 'B1' },
  'daily clean-up routine': { translation: 'rutinitas bersih-bersih harian', phraseType: 'noun_phrase', level: 'B1' },
  'boring chore': { translation: 'tugas rutin yang membosankan', phraseType: 'noun_phrase', level: 'B1' },
  'many schools': { translation: 'banyak sekolah', phraseType: 'noun_phrase', level: 'A1' },
};

// Rich vocabulary root dictionary for instant translation and level mapping
export const VOCAB_ROOT_DICT: Record<string, { translation: string; type: PhraseType; level: CEFRLevel; ipa?: string }> = {
  // Education & School
  school: { translation: 'sekolah', type: 'noun_phrase', level: 'A1', ipa: '/skuːl/' },
  schools: { translation: 'sekolah-sekolah', type: 'noun_phrase', level: 'A1' },
  student: { translation: 'siswa / murid', type: 'noun_phrase', level: 'A1', ipa: '/ˈstjuː.dənt/' },
  students: { translation: 'murid-murid', type: 'noun_phrase', level: 'A1' },
  teacher: { translation: 'guru / pengajar', type: 'noun_phrase', level: 'A1', ipa: '/ˈtiː.tʃər/' },
  teachers: { translation: 'guru-guru', type: 'noun_phrase', level: 'A1' },
  classroom: { translation: 'ruang kelas', type: 'noun_phrase', level: 'A1', ipa: '/ˈklɑːs.ruːm/' },
  library: { translation: 'perpustakaan', type: 'noun_phrase', level: 'A1', ipa: '/ˈlaɪ.brər.i/' },
  education: { translation: 'pendidikan', type: 'noun_phrase', level: 'B1', ipa: '/ˌedʒ.ʊˈkeɪ.ʃən/' },
  lesson: { translation: 'pelajaran', type: 'noun_phrase', level: 'A1' },
  homework: { translation: 'pekerjaan rumah (PR)', type: 'noun_phrase', level: 'A1' },
  exam: { translation: 'ujian', type: 'noun_phrase', level: 'A2' },
  study: { translation: 'belajar / mempelajari', type: 'verb_phrase', level: 'A1' },
  learn: { translation: 'mempelajari', type: 'verb_phrase', level: 'A1' },
  teach: { translation: 'mengajar', type: 'verb_phrase', level: 'A1' },
  read: { translation: 'membaca', type: 'verb_phrase', level: 'A1' },
  write: { translation: 'menulis', type: 'verb_phrase', level: 'A1' },
  knowledge: { translation: 'pengetahuan', type: 'noun_phrase', level: 'B1' },
  skill: { translation: 'keterampilan / keahlian', type: 'noun_phrase', level: 'A2' },
  skills: { translation: 'keterampilan-keterampilan', type: 'noun_phrase', level: 'A2' },
  practice: { translation: 'berlatih / latihan', type: 'verb_phrase', level: 'A2' },
  article: { translation: 'artikel', type: 'noun_phrase', level: 'A2' },
  articles: { translation: 'artikel-artikel', type: 'noun_phrase', level: 'A2' },
  vocabulary: { translation: 'kosakata', type: 'noun_phrase', level: 'A2' },
  phrase: { translation: 'frasa', type: 'noun_phrase', level: 'A2' },
  phrases: { translation: 'frasa-frasa', type: 'noun_phrase', level: 'A2' },
  sentence: { translation: 'kalimat', type: 'noun_phrase', level: 'A1' },
  sentences: { translation: 'kalimat-kalimat', type: 'noun_phrase', level: 'A1' },
  paragraph: { translation: 'paragraf', type: 'noun_phrase', level: 'A2' },

  // Daily life & Actions
  identify: { translation: 'mengidentifikasi / mengenali', type: 'verb_phrase', level: 'B1', ipa: '/aɪˈden.tɪ.faɪ/' },
  identifies: { translation: 'mengidentifikasi', type: 'verb_phrase', level: 'B1' },
  identified: { translation: 'teridentifikasi / telah diidentifikasi', type: 'verb_phrase', level: 'B1' },
  recall: { translation: 'mengingat kembali', type: 'verb_phrase', level: 'B1' },
  remember: { translation: 'mengingat', type: 'verb_phrase', level: 'A1' },
  understand: { translation: 'memahami / mengerti', type: 'verb_phrase', level: 'A1' },
  improve: { translation: 'meningkatkan / membaik', type: 'verb_phrase', level: 'B1' },
  improves: { translation: 'meningkatkan', type: 'verb_phrase', level: 'B1' },
  improved: { translation: 'meningkat / diperbaiki', type: 'verb_phrase', level: 'B1' },
  develop: { translation: 'mengembangkan', type: 'verb_phrase', level: 'B1' },
  create: { translation: 'menciptakan / membuat', type: 'verb_phrase', level: 'A2' },
  change: { translation: 'mengubah / perubahan', type: 'verb_phrase', level: 'A1' },
  changes: { translation: 'perubahan-perubahan', type: 'noun_phrase', level: 'A1' },
  help: { translation: 'membantu / pertolongan', type: 'verb_phrase', level: 'A1' },
  helps: { translation: 'membantu', type: 'verb_phrase', level: 'A1' },
  work: { translation: 'bekerja / pekerjaan', type: 'verb_phrase', level: 'A1' },
  works: { translation: 'bekerja / karya', type: 'verb_phrase', level: 'A1' },
  build: { translation: 'membangun', type: 'verb_phrase', level: 'A2' },
  provide: { translation: 'menyediakan / memberi', type: 'verb_phrase', level: 'B1' },
  provides: { translation: 'menyediakan', type: 'verb_phrase', level: 'B1' },
  require: { translation: 'memerlukan / mensyaratkan', type: 'verb_phrase', level: 'B1' },
  requires: { translation: 'memerlukan', type: 'verb_phrase', level: 'B1' },
  protect: { translation: 'melindungi', type: 'verb_phrase', level: 'B1' },
  support: { translation: 'mendukung / bantuan', type: 'verb_phrase', level: 'B1' },
  participate: { translation: 'berpartisipasi', type: 'verb_phrase', level: 'B1' },
  participates: { translation: 'berpartisipasi', type: 'verb_phrase', level: 'B1' },
  participated: { translation: 'telah berpartisipasi', type: 'verb_phrase', level: 'B1' },
  achieve: { translation: 'mencapai / meraih', type: 'verb_phrase', level: 'B1' },
  reduce: { translation: 'mengurangi', type: 'verb_phrase', level: 'B1' },
  increase: { translation: 'meningkatkan / bertambah', type: 'verb_phrase', level: 'B1' },
  maintain: { translation: 'memelihara / mempertahankan', type: 'verb_phrase', level: 'B2' },

  // Environment & Nature
  environment: { translation: 'lingkungan', type: 'noun_phrase', level: 'A2', ipa: '/ɪnˈvaɪ.rən.mənt/' },
  nature: { translation: 'alam / sifat alami', type: 'noun_phrase', level: 'A2' },
  earth: { translation: 'bumi', type: 'noun_phrase', level: 'A2' },
  climate: { translation: 'iklim', type: 'noun_phrase', level: 'B1' },
  planet: { translation: 'planet', type: 'noun_phrase', level: 'A2' },
  water: { translation: 'air / menyiram', type: 'noun_phrase', level: 'A1' },
  plant: { translation: 'tanaman / tumbuhan', type: 'noun_phrase', level: 'A1' },
  plants: { translation: 'tanaman-tanaman', type: 'noun_phrase', level: 'A1' },
  garden: { translation: 'taman / kebun', type: 'noun_phrase', level: 'A1' },
  gardens: { translation: 'taman-taman', type: 'noun_phrase', level: 'A1' },
  tree: { translation: 'pohon', type: 'noun_phrase', level: 'A1' },
  trees: { translation: 'pohon-pohon', type: 'noun_phrase', level: 'A1' },
  forest: { translation: 'hutan', type: 'noun_phrase', level: 'A2' },
  ocean: { translation: 'lautan / samudera', type: 'noun_phrase', level: 'A2' },
  animal: { translation: 'hewan / binatang', type: 'noun_phrase', level: 'A1' },
  animals: { translation: 'hewan-hewan', type: 'noun_phrase', level: 'A1' },
  species: { translation: 'spesies / jenis hayati', type: 'noun_phrase', level: 'B1' },
  pollution: { translation: 'polusi / pencemaran', type: 'noun_phrase', level: 'B1' },
  energy: { translation: 'energi / daya', type: 'noun_phrase', level: 'A2' },
  resource: { translation: 'sumber daya', type: 'noun_phrase', level: 'B1' },
  resources: { translation: 'sumber daya', type: 'noun_phrase', level: 'B1' },

  // Society, Objects & Rooms
  society: { translation: 'masyarakat', type: 'noun_phrase', level: 'B1' },
  community: { translation: 'komunitas / masyarakat', type: 'noun_phrase', level: 'A2' },
  government: { translation: 'pemerintah', type: 'noun_phrase', level: 'B1' },
  technology: { translation: 'teknologi', type: 'noun_phrase', level: 'A2', ipa: '/tekˈnɒl.ə.dʒi/' },
  science: { translation: 'sains / ilmu pengetahuan', type: 'noun_phrase', level: 'A2' },
  research: { translation: 'penelitian / riset', type: 'noun_phrase', level: 'B1' },
  information: { translation: 'informasi', type: 'noun_phrase', level: 'A2' },
  system: { translation: 'sistem', type: 'noun_phrase', level: 'A2' },
  result: { translation: 'hasil / akibat', type: 'noun_phrase', level: 'A2' },
  results: { translation: 'hasil-hasil', type: 'noun_phrase', level: 'A2' },
  solution: { translation: 'solusi / pemecahan masalah', type: 'noun_phrase', level: 'B1' },
  problem: { translation: 'masalah / kendala', type: 'noun_phrase', level: 'A1' },
  problems: { translation: 'masalah-masalah', type: 'noun_phrase', level: 'A1' },
  challenge: { translation: 'tantangan', type: 'noun_phrase', level: 'B1' },
  future: { translation: 'masa depan', type: 'noun_phrase', level: 'A1' },
  history: { translation: 'sejarah', type: 'noun_phrase', level: 'A2' },
  culture: { translation: 'budaya', type: 'noun_phrase', level: 'A2' },
  health: { translation: 'kesehatan', type: 'noun_phrase', level: 'A2' },
  activity: { translation: 'aktivitas / kegiatan', type: 'noun_phrase', level: 'A2' },
  activities: { translation: 'kegiatan-kegiatan', type: 'noun_phrase', level: 'A2' },
  team: { translation: 'tim / regu', type: 'noun_phrase', level: 'A1' },
  teams: { translation: 'tim-tim', type: 'noun_phrase', level: 'A1' },
  desk: { translation: 'meja tulis', type: 'noun_phrase', level: 'A1' },
  desks: { translation: 'meja-meja tulis', type: 'noun_phrase', level: 'A1' },
  floor: { translation: 'lantai', type: 'noun_phrase', level: 'A1' },
  door: { translation: 'pintu', type: 'noun_phrase', level: 'A1' },
  doors: { translation: 'pintu-pintu', type: 'noun_phrase', level: 'A1' },
  window: { translation: 'jendela', type: 'noun_phrase', level: 'A1' },
  routine: { translation: 'rutinitas', type: 'noun_phrase', level: 'A2' },
  effort: { translation: 'upaya / usaha', type: 'noun_phrase', level: 'B1' },
  recess: { translation: 'waktu istirahat', type: 'noun_phrase', level: 'B1' },
  volunteer: { translation: 'sukarelawan', type: 'noun_phrase', level: 'B1' },
  volunteers: { translation: 'sukarelawan', type: 'noun_phrase', level: 'B1' },
  chore: { translation: 'tugas rutin harian', type: 'noun_phrase', level: 'B1' },
  chores: { translation: 'tugas-tugas rutin', type: 'noun_phrase', level: 'B1' },
  atmosphere: { translation: 'suasana / atmosfer', type: 'noun_phrase', level: 'B1' },
  responsibility: { translation: 'tanggung jawab', type: 'noun_phrase', level: 'B1', ipa: '/rɪˌspɒn.səˈbɪl.ə.ti/' },

  // Descriptives (Adjectives)
  important: { translation: 'penting', type: 'adj_phrase', level: 'A1', ipa: '/ɪmˈpɔː.tənt/' },
  necessary: { translation: 'perlu / dibutuhkan', type: 'adj_phrase', level: 'B1' },
  essential: { translation: 'sangat penting / mendasar', type: 'adj_phrase', level: 'B2' },
  significant: { translation: 'signifikan / bermakna', type: 'adj_phrase', level: 'B2' },
  critical: { translation: 'kritis / sangat penting', type: 'adj_phrase', level: 'B2' },
  different: { translation: 'berbeda', type: 'adj_phrase', level: 'A1' },
  similar: { translation: 'mirip / serupa', type: 'adj_phrase', level: 'B1' },
  effective: { translation: 'efektif', type: 'adj_phrase', level: 'B1' },
  efficient: { translation: 'efisien', type: 'adj_phrase', level: 'B2' },
  simple: { translation: 'sederhana', type: 'adj_phrase', level: 'A2' },
  complex: { translation: 'kompleks / rumit', type: 'adj_phrase', level: 'B2' },
  natural: { translation: 'alami / natural', type: 'adj_phrase', level: 'A2' },
  peaceful: { translation: 'damai / tenang', type: 'adj_phrase', level: 'A2' },
  useful: { translation: 'bermanfaat / berguna', type: 'adj_phrase', level: 'A2' },
  creative: { translation: 'kreatif', type: 'adj_phrase', level: 'A2' },
  clean: { translation: 'bersih', type: 'adj_phrase', level: 'A1' },
  dirty: { translation: 'kotor', type: 'adj_phrase', level: 'A1' },
  tidy: { translation: 'rapi', type: 'adj_phrase', level: 'A2' },
  safe: { translation: 'aman', type: 'adj_phrase', level: 'A2' },
  successful: { translation: 'sukses / berhasil', type: 'adj_phrase', level: 'A2' },
  global: { translation: 'global / mendunia', type: 'adj_phrase', level: 'B1' },
  daily: { translation: 'harian / setiap hari', type: 'adj_phrase', level: 'A2' },
  shared: { translation: 'bersama / dibagi', type: 'adj_phrase', level: 'B1' },
  wooden: { translation: 'berbahan kayu', type: 'adj_phrase', level: 'A2' },
  narrow: { translation: 'sempit', type: 'adj_phrase', level: 'B1' },
  locked: { translation: 'terkunci', type: 'adj_phrase', level: 'A2' },
  quiet: { translation: 'tenang / sunyi', type: 'adj_phrase', level: 'A2' },
  noisy: { translation: 'bising / gaduh', type: 'adj_phrase', level: 'A2' },
  dry: { translation: 'kering', type: 'adj_phrase', level: 'A2' },
  wet: { translation: 'basah', type: 'adj_phrase', level: 'A1' },
  fresh: { translation: 'segar', type: 'adj_phrase', level: 'A2' },

  // Adverbs
  quickly: { translation: 'dengan cepat', type: 'adv_phrase', level: 'A1' },
  slowly: { translation: 'dengan lambat', type: 'adv_phrase', level: 'A1' },
  carefully: { translation: 'dengan hati-hati', type: 'adv_phrase', level: 'A2' },
  easily: { translation: 'dengan mudah', type: 'adv_phrase', level: 'A2' },
  clearly: { translation: 'dengan jelas', type: 'adv_phrase', level: 'A2' },
  recently: { translation: 'baru-baru ini', type: 'adv_phrase', level: 'B1' },
  currently: { translation: 'saat ini', type: 'adv_phrase', level: 'B1' },
  especially: { translation: 'khususnya / terutama', type: 'adv_phrase', level: 'A2' },
  usually: { translation: 'biasanya', type: 'adv_phrase', level: 'A2' },
  always: { translation: 'selalu', type: 'adv_phrase', level: 'A1' },
  never: { translation: 'tidak pernah', type: 'adv_phrase', level: 'A1' },
  often: { translation: 'sering', type: 'adv_phrase', level: 'A1' },
  sometimes: { translation: 'kadang-kadang', type: 'adv_phrase', level: 'A1' },
};

// Known grammar closed-class word sets for automatic POS chunking
const COMMON_DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her',
  'its', 'our', 'their', 'every', 'each', 'all', 'some', 'any', 'many', 'much',
  'few', 'several', 'both', 'either', 'neither', 'no'
]);

const COMMON_PREPOSITIONS = new Set([
  'in', 'on', 'at', 'by', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'over',
  'under', 'across', 'behind', 'beside', 'near', 'along', 'without', 'toward', 'inside'
]);

const COMMON_AUX_VERBS = new Set([
  'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'shall', 'should', 'may',
  'might', 'must'
]);

const COMMON_CONNECTORS = new Set([
  'however', 'therefore', 'furthermore', 'moreover', 'meanwhile', 'nevertheless',
  'consequently', 'otherwise', 'finally', 'additionally', 'similarly', 'conversely'
]);

export function normalizeText(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim();
}

/**
 * Finds translation and grammar metadata for any word or phrase.
 * If not in dictionary, infers grammar type and provides meaningful metadata.
 */
export function findTranslation(rawText: string): {
  translation: string;
  phraseType: PhraseType;
  level: CEFRLevel;
  ipa?: string;
  explanation?: string;
} {
  const clean = normalizeText(rawText);

  // 1. Check BUILTIN_DICTIONARY
  if (BUILTIN_DICTIONARY[clean]) {
    return BUILTIN_DICTIONARY[clean];
  }

  // 2. Check singular/plural variants
  if (clean.endsWith('s') && BUILTIN_DICTIONARY[clean.slice(0, -1)]) {
    const item = BUILTIN_DICTIONARY[clean.slice(0, -1)];
    return { ...item, translation: `${item.translation} (jamak)` };
  }

  // 3. Check VOCAB_ROOT_DICT
  if (VOCAB_ROOT_DICT[clean]) {
    const item = VOCAB_ROOT_DICT[clean];
    return {
      translation: item.translation,
      phraseType: item.type,
      level: item.level,
      ipa: item.ipa,
    };
  }

  // Check stemmed forms (-ing, -ed, -s)
  if (clean.endsWith('ing') && VOCAB_ROOT_DICT[clean.slice(0, -3)]) {
    const item = VOCAB_ROOT_DICT[clean.slice(0, -3)];
    return {
      translation: `sedang ${item.translation}`,
      phraseType: 'verb_phrase',
      level: item.level,
    };
  }
  if (clean.endsWith('ed') && VOCAB_ROOT_DICT[clean.slice(0, -2)]) {
    const item = VOCAB_ROOT_DICT[clean.slice(0, -2)];
    return {
      translation: `telah ${item.translation}`,
      phraseType: 'verb_phrase',
      level: item.level,
    };
  }

  // Multi-word phrase heuristic
  const words = clean.split(/\s+/);
  if (words.length > 1) {
    if (COMMON_PREPOSITIONS.has(words[0])) {
      return { translation: rawText, phraseType: 'preposition', level: 'B1' };
    }
    if (COMMON_AUX_VERBS.has(words[0])) {
      return { translation: rawText, phraseType: 'verb_phrase', level: 'B1' };
    }
    return { translation: rawText, phraseType: 'noun_phrase', level: 'A2' };
  }

  // Single word morphological inference
  let estimatedType: PhraseType = 'noun_phrase';
  let estimatedLevel: CEFRLevel = 'A2';

  if (COMMON_CONNECTORS.has(clean)) {
    estimatedType = 'connector';
    estimatedLevel = 'B1';
  } else if (COMMON_PREPOSITIONS.has(clean)) {
    estimatedType = 'preposition';
    estimatedLevel = 'A1';
  } else if (clean.endsWith('ly')) {
    estimatedType = 'adv_phrase';
    estimatedLevel = 'B1';
  } else if (clean.endsWith('tion') || clean.endsWith('ment') || clean.endsWith('ness') || clean.endsWith('ity')) {
    estimatedType = 'noun_phrase';
    estimatedLevel = 'B1';
  } else if (clean.endsWith('able') || clean.endsWith('ive') || clean.endsWith('ous') || clean.endsWith('ful') || clean.endsWith('al')) {
    estimatedType = 'adj_phrase';
    estimatedLevel = 'B1';
  } else if (clean.endsWith('ize') || clean.endsWith('ate') || clean.endsWith('ify')) {
    estimatedType = 'verb_phrase';
    estimatedLevel = 'B2';
  }

  return {
    translation: rawText,
    phraseType: estimatedType,
    level: estimatedLevel,
  };
}

/**
 * Comprehensive NLP automatic phrase extractor for any English article.
 * Detects:
 * 1. Phrasal verbs with all inflections (-s, -ed, -ing, past irregular)
 * 2. Multi-word Prepositional Phrases
 * 3. Discourse connectors & transitional phrases
 * 4. Noun Phrases (Adjective(s) + Noun(s), Compound Nouns, hyphenated nouns)
 */
export function extractAutomaticPhrases(text: string): {
  phrase: string;
  type: PhraseType;
  level: CEFRLevel;
}[] {
  const results: { phrase: string; type: PhraseType; level: CEFRLevel }[] = [];
  const seen = new Set<string>();

  const register = (p: string, type: PhraseType, level: CEFRLevel) => {
    const clean = p.trim();
    const norm = normalizeText(clean);
    if (!norm || seen.has(norm)) return;
    seen.add(norm);
    results.push({ phrase: clean, type, level });
  };

  // 1. Built-in multi-word matches found in text
  for (const [key, entry] of Object.entries(BUILTIN_DICTIONARY)) {
    if (key.includes(' ') || key.includes('-')) {
      const regex = new RegExp(`\\b${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      const match = regex.exec(text);
      if (match) {
        register(match[0], entry.phraseType, entry.level);
      }
    }
  }

  // 2. Connectors & Transition expressions
  const connRegex = /\b(on the other hand|in addition to|in addition|as a result|for example|for instance|in conclusion|in contrast|first of all|in particular|in other words|to begin with|in summary|even though|however|therefore|furthermore|moreover|nevertheless|meanwhile|consequently)\b/gi;
  let match: RegExpExecArray | null;
  while ((match = connRegex.exec(text)) !== null) {
    register(match[0], 'connector', 'B1');
  }

  // 3. Prepositional phrases
  const prepRegex = /\b(according to|in front of|because of|due to|instead of|in spite of|as well as|at the end of|in terms of|with regard to|such as|along with|prior to|thanks to|based on|in order to|above the [a-z]+|beside the [a-z]+|near the [a-z]+|during [a-z]+ [a-z]+)\b/gi;
  while ((match = prepRegex.exec(text)) !== null) {
    register(match[0], 'preposition', 'B1');
  }

  // 4. Phrasal verbs with inflections (base, -s, -ed, -ing, irregular past)
  // Verbs: focus, depend, lead/led, turn, look, carry, clean, break/broke, point, give/gave, take/took, deal/dealt, participate, find/found, set, figure, grow/grew, wake/woke, bring/brought, check, fill, sweep, cover, spend/spent, make/made
  const phrasalVerbRegex = /\b(focus(?:es|ed|ing)?|depend(?:s|ed|ing)?|lead(?:s|ing)?|led|turn(?:s|ed|ing)?|look(?:s|ed|ing)?|carr(?:y|ies|ied|ying)|clean(?:s|ed|ing)?|break(?:s|ing)?|broke(?:n)?|point(?:s|ed|ing)?|giv(?:e|es|ing)|gave|given|take(?:s|n|ing)?|took|deal(?:s|ing)?|dealt|participat(?:e|es|ed|ing)|find(?:s|ing)?|found|set(?:s|ting)?|figur(?:e|es|ed|ing)|grow(?:s|ing)?|grew|grown|wak(?:e|es|ed|ing)|woke(?:n)?|bring(?:s|ing)?|brought|check(?:s|ed|ing)?|fill(?:s|ed|ing)?|sweep(?:s|ing)?|swept|cover(?:s|ed|ing)?|spend(?:s|ing)?|spent|mak(?:e|es|ing)?|made)\s+(on|to|into|after|out|up|down|with|in|fresh|better|time|sure|the plants|the watering cans|the floor)\b/gi;
  while ((match = phrasalVerbRegex.exec(text)) !== null) {
    register(match[0], 'verb_phrase', 'B1');
  }

  // 5. Noun Phrases (Adjective(s) + Noun(s) or Compound Noun phrases)
  // Includes wide adjective suffixes (-al, -ic, -ive, -ous, -ful, -able, -ible, -ant, -ent, -ed, -ing)
  // and qualitative descriptive roots + noun roots
  const adjNounRegex = /\b((?:clean|green|small|large|huge|great|big|tiny|important|useful|natural|quiet|peaceful|daily|young|senior|public|private|digital|global|simple|fresh|dry|wet|wooden|glass|social|scientific|renewable|solar|electric|tidy|calm|narrow|wide|tall|short|blue|red|bright|dark|cool|warm|soft|hard|secret|noisy|boring|difficult|easy|special|rich|poor|safe|modern|shared|locked|dedicated|[a-zA-Z]+(?:al|ic|ical|ive|ous|ful|able|ible|ant|ent|ed|ing))(?:\s+(?:green|small|clean|wooden|glass|peaceful|fresh|dry|wet|tall|cool|soft|quiet|young))?)\s+([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)?(?:\s+[a-zA-Z0-9]+)?)\b/gi;

  while ((match = adjNounRegex.exec(text)) !== null) {
    const fullMatch = match[0].trim();
    const words = fullMatch.split(/\s+/);
    // Ignore if starting with common determiners or prepositions or verbs
    if (words.length >= 2 && words.length <= 4) {
      const firstWord = words[0].toLowerCase();
      if (!COMMON_DETERMINERS.has(firstWord) && !COMMON_PREPOSITIONS.has(firstWord) && !COMMON_AUX_VERBS.has(firstWord)) {
        register(fullMatch, 'noun_phrase', 'A2');
      }
    }
  }

  // 6. Compound Nouns with hyphens or spaces (e.g. "clean-up team", "rooftop garden", "science teacher")
  const compoundNounRegex = /\b([a-zA-Z]+(?:-[a-zA-Z]+)?)\s+(team|garden|teacher|room|stairway|door|floor|plants|cans|boxes|mint|club|pots|bench|place|field|trees|friends|air|shade|mornings|insects|volunteers|leaves|bag|shelf|year|shavings|routine|chore|process|factor|success|difference|environment|system|service|development|protection|sources|vehicles)\b/gi;
  while ((match = compoundNounRegex.exec(text)) !== null) {
    register(match[0], 'noun_phrase', 'A2');
  }

  return results;
}

// Visual color palette matching grammar categories
export const PHRASE_TYPE_COLORS: Record<PhraseType, {
  label: string;
  badgeBg: string;
  badgeText: string;
  underline: string;
  textColor: string;
  dotColor: string;
}> = {
  noun_phrase: {
    label: 'Frasa Nomina (Noun)',
    badgeBg: 'bg-blue-100 dark:bg-blue-950',
    badgeText: 'text-blue-700 dark:text-blue-300',
    underline: 'decoration-blue-500 underline decoration-2 underline-offset-4',
    textColor: 'text-blue-700 dark:text-blue-400 font-medium',
    dotColor: '#2563eb',
  },
  verb_phrase: {
    label: 'Frasa Verba (Verb)',
    badgeBg: 'bg-rose-100 dark:bg-rose-950',
    badgeText: 'text-rose-700 dark:text-rose-300',
    underline: 'decoration-rose-500 underline decoration-2 underline-offset-4',
    textColor: 'text-rose-700 dark:text-rose-400 font-medium',
    dotColor: '#e11d48',
  },
  adj_phrase: {
    label: 'Frasa Adjektiva (Adjective)',
    badgeBg: 'bg-purple-100 dark:bg-purple-950',
    badgeText: 'text-purple-700 dark:text-purple-300',
    underline: 'decoration-purple-500 underline decoration-2 underline-offset-4',
    textColor: 'text-purple-700 dark:text-purple-400 font-medium',
    dotColor: '#9333ea',
  },
  adv_phrase: {
    label: 'Frasa Adverbia (Adverb)',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-800 dark:text-amber-300',
    underline: 'decoration-amber-500 underline decoration-2 underline-offset-4',
    textColor: 'text-amber-700 dark:text-amber-400 font-medium',
    dotColor: '#d97706',
  },
  connector: {
    label: 'Frasa Penghubung (Connector)',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    underline: 'decoration-emerald-500 underline decoration-2 underline-offset-4',
    textColor: 'text-emerald-700 dark:text-emerald-400 font-medium',
    dotColor: '#059669',
  },
  preposition: {
    label: 'Frasa Preposisi (Preposition)',
    badgeBg: 'bg-teal-100 dark:bg-teal-950',
    badgeText: 'text-teal-700 dark:text-teal-300',
    underline: 'decoration-teal-500 underline decoration-2 underline-offset-4',
    textColor: 'text-teal-700 dark:text-teal-400 font-medium',
    dotColor: '#0d9488',
  },
  fixed_expression: {
    label: 'Ungkapan Tetap (Expression)',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    underline: 'decoration-indigo-500 underline decoration-2 underline-offset-4',
    textColor: 'text-indigo-700 dark:text-indigo-400 font-medium',
    dotColor: '#4f46e5',
  },
};
