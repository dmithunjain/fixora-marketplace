import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  InputBase,
  Menu,
  Avatar,
  Container,
  CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MyLocationIcon from "@mui/icons-material/MyLocation";

import { Link, useNavigate } from "react-router-dom";
import { publicServiceAPI } from "../services/api";
import { useState, useContext } from "react";
import logo from "../assets/Logo1.png";
import { AuthContext } from "../context/AuthContext";

const indianLocations = {
  "Andaman and Nicobar Islands": {
    districts: {
      "Nicobar": ["Car Nicobar", "Nancowrie", "Great Nicobar"],
      "North and Middle Andaman": ["Diglipur", "Mayabunder", "Rangat"],
      "South Andaman": ["Port Blair", "Ferrargunj", "Little Andaman"]
    }
  },
  "Andhra Pradesh": {
    districts: {
      "Alluri Sitharama Raju": ["Rampachodavaram", "Narsipatnam", "Peda Gummileru"],
      "Anakapalli": ["Anakapalli", "K Kotakota", "Munagottal"],
      "Anantapur": ["Anantapur", "Dharmavaram", "Hindupur", "Rayadurg", "Guntakal", "Tadpatri", "Madakasira", "Kalyandurg"],
      "Annamayya": ["Madanapalle", "Rajampeta", "Piler", "Santhi Ravandlapalle"],
      "Bapatla": ["Bapatla", "Chirala", "Ongole", "Kandukuru", "Vetapalem"],
      "Chittoor": ["Chittoor", "Tirupati", "Madanapalle", "Srikalahasti", "Puttur", "Nagari"],
      "Dr. B.R. Ambedkar Konaseema": ["Amalapuram", "Rajahmundry", "Kakinada", "Mummidivaram", "Razole"],
      "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram", "Eluru", "Mandapeta", "Rampachodavaram"],
      "Krishna": ["Vijayawada", "Guntur", "Machilipatnam", "Nuzvid", "Tiruvuru", "Kankipadu"],
      "Kurnool": ["Kurnool", "Adoni", "Yemmiganur", "Nandyal", "Kallur", "Rayachoti"],
      "Nellore": ["Nellore", "Kavali", "Sullurpeta", "Gudur", "Venkatagiri", "Naidupeta"],
      "Prakasam": ["Ongole", "Markapur", "Chirala", "Kandukuru", "Santhamaguluru"],
      "Sri Potti Sriramulu Nellore": ["Nellore", "Kavali", "Gudur", "Sullurpeta", "Venkatagiri"],
      "Sri Sathya Sai": ["Hindupur", "Madhugunta", "Lelegadda", "Amarapuram"],
      "Srikakulam": ["Srikakulam", "Palakonda", "Tekkali", "Narasannapeta", "Palasa"],
      "Visakhapatnam": ["Visakhapatnam", "Vizianagaram", "Anakapalli", "Nakkapalli", "Bheemunipatnam"],
      "Vizianagaram": ["Vizianagaram", "Bobbili", "Parvathipuram", "Salur", "Chipurupalle"],
      "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem", "Kovvur", "Narasapuram", "Jangareddygudem"]
    }
  },
  "Arunachal Pradesh": {
    districts: {
      "Tawang": ["Tawang", "Lumla", "Jang", "Dirang"],
      "West Kameng": ["Bomdila", "Rupa", "Tezpur", "Kalaktang"],
      "East Kameng": ["Seppa", "Paka", "Bameng", "Lada"],
      "Papum Pare": ["Itanagar", "Naharlagun", "Nirjuli", "Balijan"],
      "Lower Subansiri": ["Ziro", "Yachuli", "Pistana", "Daporijo"],
      "Upper Subansiri": ["Daporijo", "Taksing", "Balek"],
      "West Siang": ["Aalo", "Kaying", "Kangku", "Likabali"],
      "East Siang": ["Pasighat", "Mebo", "Oyan", "Ranglu"],
      "Upper Siang": ["Yingkiong", "Geku", "Mariyang"],
      "Lower Siang": ["Basar", "Likabali", "Sibe"],
      "Changlang": ["Changlang", "Miao", "Nampong", "Diyun"],
      "Tirap": ["Khonsa", "Deomali", "Longding", "Pongchaw"],
      "Longding": ["Longding", "Pangchao", "Kanubari"],
      "Kra Daadi": ["Palin", "Sangram", "Koloriang"],
      "Kurung Kumey": ["Koloriang", "Nyapin", "Pappin"],
      "Kamle": ["Raga", "Kamle", "Dampori"],
      "Lepa Rada": ["Basar", "Darak", "Kamba"],
      "Shi Yomi": ["Anini", "Mechuka", "Tato"],
      "Siang": ["Boleng", "Passighat", "Koram"],
      "Namsang": ["Namsang", "Longding", "Kanubari"],
      "Pakke Kessang": ["Seijosa", "Bhalukpong", "Chyangtajo"]
    }
  },
  "Assam": {
    districts: {
      "Baksa": ["Baksa", "Barama", "Baghbor", "Tamulpur"],
      "Barpeta": ["Barpeta", "Baghbor", "Sarupeta", "Jalah"],
      "Biswanath": ["Biswanath Chariali", "Gohpur", "Behali", "Halem"],
      "Bongaigaon": ["Bongaigaon", "Boitamari", "Srijangram", "Dudhnoi"],
      "Cachar": ["Silchar", "Lakhipur", "Sonai", "Katigora"],
      "Charaideo": ["Sonari", "Moran", "Dibrugarh", "Sivasagar"],
      "Chirang": ["Bongaigaon", "Kokrajhar", "Sidli", "Bijni"],
      "Darrang": ["Tezpur", "Mangaldoi", "Dalgaon", "Khoirabari"],
      "Dhemaji": ["Dhemaji", "Jonai", "Sissibargaon", "Murkongselek"],
      "Dhubri": ["Dhubri", "Gauripur", "Fekamari", "Bilasipara"],
      "Dibrugarh": ["Dibrugarh", "Moran", "Naharkatiya", "Tinsukia"],
      "Dima Hasao": ["Haflong", "Umrangso", "Mahur", "N.C. Hills"],
      "Goalpara": ["Goalpara", "Lakhipur", "Balijana", "Matia"],
      "Golaghat": ["Golaghat", "Jorhat", "Sivasagar", "Bokakhat"],
      "Hailakandi": ["Hailakandi", "Lala", "Katlicherra", "Algapur"],
      "Hojai": ["Hojai", "Dobaka", "Lanka", "Nagaon"],
      "Jorhat": ["Jorhat", "Titabor", "Mariani", "Bokakhat"],
      "Kamrup": ["Amingaon", "Palashbari", "Goreswar", "Koya Kuchi"],
      "Kamrup Metropolitan": ["Guwahati", "Chandigarh", "Dispur", "Borjhar"],
      "Karbi Anglong": ["Diphu", "Hamren", "Socheng", "Langkhet"],
      "Karimganj": ["Karimganj", "Badarpur", "Nilambazar", "Ramkrishna"],
      "Kokrajhar": ["Kokrajhar", "Gossaigaon", "Bijni", "Sidli"],
      "Lakhimpur": ["North Lakhimpur", "Dhakuakhana", "Subansiri", "Ghilamara"],
      "Majuli": ["Majuli", "Jorhat", "Kamrup", "Sivasagar"],
      "Morigaon": ["Morigaon", "Mongoldoi", "Bhuragaon", "Nagaon"],
      "Nagaon": ["Nagaon", "Hojai", "Lumding", "Dobaka"],
      "Nalbari": ["Nalbari", "Barkhetri", "Ghoghrapur", "Paka"],
      "Sivasagar": ["Sivasagar", "Jorhat", "Nazira", "Sonari"],
      "Sonitpur": ["Tezpur", "Biswanath", "Dhekiajuli", "Gohpur"],
      "South Salmara-Mankachar": ["Hatsingimari", "Mankachar", "Bijni"],
      "Tinsukia": ["Tinsukia", "Dibrugarh", "Margherita", "Ledo"],
      "Udalguri": ["Udalguri", "Baskandi", "Khoirabari", "Darrang"],
      "West Karbi Anglong": ["Hamren", "Socheng", "Diphu", "Baithalangso"]
    }
  },
  "Bihar": {
    districts: {
      "Araria": ["Araria", "Forbesganj", "Jokihat", "Sikti"],
      "Arwal": ["Arwal", "Kaler", "Karakat", "Kalashah"],
      "Aurangabad": ["Aurangabad", "Gaya", "Obra", "Rafiganj"],
      "Banka": ["Banka", "Amarpur", "Bariarpur", "Shambhuganj"],
      "Begusarai": ["Begusarai", "Barauni", "Khagaria", "Mansi"],
      "Bhagalpur": ["Bhagalpur", "Naugachhia", "Balia", "Kahalgaon"],
      "Bhojpur": ["Arrah", "Bhojpur", "Sasaram", "Din Dayal"],
      "Buxar": ["Buxar", "Brahmapur", "Dumraon", "Rajpur"],
      "Darbhanga": ["Darbhanga", "Benipur", "Bahadurganj", "Jale"],
      "East Champaran": ["Motihari", "Betiah", "Raxaul", "Sugni"],
      "Gaya": ["Gaya", "Sherghati", "Nabinagar", "Bodh Gaya"],
      "Gopalganj": ["Gopalganj", "Mirganj", "Hathua", "Siwan"],
      "Jamui": ["Jamui", "Jhajha", "Chakai", "Sikandra"],
      "Jehanabad": ["Jehanabad", "Makhdumpur", "Hulasganj", "Karath"],
      "Kaimur": ["Bhabhua", "Bhainsa", "Kaimur", "Kudra"],
      "Katihar": ["Katihar", "Purnia", "Manihari", "Amour"],
      "Khagaria": ["Khagaria", "Gogri", "Mansi", "Chakai"],
      "Kishanganj": ["Kishanganj", "Bahadurganj", "Thakurganj", "Pothia"],
      "Lakhisarai": ["Lakhisarai", "Barahiya", "Hasanpur", "Samuel"],
      "Madhepura": ["Madhepura", "Kahara", "Bihariganj", "Chousa"],
      "Madhubani": ["Madhubani", "Jaynagar", "Jainagar", "Benipatti"],
      "Munger": ["Munger", "Jamalpur", "Kharagpur", "Asarganj"],
      "Muzaffarpur": ["Muzaffarpur", "Bettiah", "Sitamarhi", "Sheohar"],
      "Nalanda": ["Bihar Sharif", "Nalanda", "Hilsa", "Rajgir"],
      "Nawada": ["Nawada", "Hisua", "Warisaliganj", "Kasheshwar"],
      "Patna": ["Patna", "Puna", "Barh", "Bihar"],
      "Purnia": ["Purnia", "Katihar", "Araria", "Madhepura"],
      "Rohtas": ["Sasaram", "Dehri", "Bhabhua", "Aurangabad"],
      "Saharsa": ["Sahara", "Madhepura", "Kahara", "Salkhua"],
      "Samastipur": ["Samastipur", "Darbhanga", "Rosera", "Hasanpur"],
      "Saran": ["Chhapra", "Sonepur", "Marhaura", "Revelganj"],
      "Sheikhpura": ["Sheikhpura", "Sheikhpura", "Gurpa", "Barbigha"],
      "Sheohar": ["Sheohar", "Sitamarhi", "Bettiah", "Muzaffarpur"],
      "Sitamarhi": ["Sitamarhi", "Bettiah", "Raxaul", "Sikroni"],
      "Siwan": ["Siwan", "Gopalganj", "Mairwa", "Maharajganj"],
      "Supaul": ["Supaul", "Birpur", "Nirmali", "Triveniganj"],
      "Vaishali": ["Hajipur", "Mahua", "Raghopur", "Patepur"],
      "West Champaran": ["Bettiah", "Bagaha", "Narkatiaganj", "Raxaul"]
    }
  },
  "Chandigarh": {
    districts: {
      "Chandigarh": ["Chandigarh"]
    }
  },
  "Chhattisgarh": {
    districts: {
      "Balod": ["Balod", "Gunderdehi", "Dondi", "Rajnandgaon"],
      "Baloda Bazar": ["Baloda Bazar", " Bhatapara", "Simga", "Palhi"],
      "Balrampur": ["Balrampur", "Ramanujganj", "Wadrafnagar", "Shankargarh"],
      "Bastar": ["Jagdalpur", "Kanker", "Narayanpur", "Bastar"],
      "Bemetara": ["Bemetara", "Saja", "Nawagarh", "Berla"],
      "Bijapur": ["Bijapur", "Bhairamgarh", "Konta", "Sukma"],
      "Bilaspur": ["Bilaspur", "Masturi", "Pendra", "Lormi"],
      "Dantewada": ["Dantewada", "Geedam", "Kuknar", "Barsur"],
      "Dhamtari": ["Dhamtari", "Kurud", "Magarlod", "Dhamtari"],
      "Durg": ["Durg", "Bhilai", "Rajnandgaon", "Patan"],
      "Gariaband": ["Gariaband", "Fingeshwar", "Chhura", "Bindra"],
      "Gaurela Pendra Marwahi": ["Gaurela", "Pendra", "Marwahi", "Takshpur"],
      "Janjgir-Champa": ["Janjgir", "Champa", "Naila", "Sakti"],
      "Jashpur": ["Jashpur", "Kansabel", "Sonder", "Farsabahar"],
      "Kabirdham": ["Kawardha", "Pandariya", "Bodla", "Sahaspur"],
      "Kanker": ["Kanker", "Narharpur", "Bhanupratappur", "Koyalibeda"],
      "Kondagaon": ["Kondagaon", "Keshkal", "Makdi", "Narharpur"],
      "Korba": ["Korba", "Katghora", "Pali", "Powarkheda"],
      "Koriya": ["Baikunthpur", "Koriya", "Sonhat", "Manendragarh"],
      "Mahasamund": ["Mahasamund", "Bagbahra", "Pithora", "Rajim"],
      "Mungeli": ["Mungeli", "Lormi", "Takhatpur", "Patharia"],
      "Narayanpur": ["Narayanpur", "Orchha", "T纳哈兰普尔"],
      "Raipur": ["Raipur", "Mandra", "Abhanpur", "Tilda"],
      "Rajnandgaon": ["Rajnandgaon", "Dongargarh", "Khairagarh", "Chowki"],
      "Sukma": ["Sukma", "Konta", "Chhindgarh", "Dharmapuri"],
      "Surguja": ["Ambikapur", "Wadrafnagar", "Pratappur", "Rajpur"]
    }
  },
  "Dadra and Nagar Haveli and Daman and Diu": {
    districts: {
      "Daman": ["Daman", "Bhimpore", "Kachigaum", "Mota Sandha"],
      "Diu": ["Diu", "Vanakbara", "Delvada", "Saiya"],
      "Dadra and Nagar Haveli": ["Silvassa", "Khanvel", "Naroli", "Rakholi"]
    }
  },
  "Delhi": {
    districts: {
      "Central Delhi": ["Darya Ganj", "Paharganj", "Karol Bagh", "Connaught Place"],
      "East Delhi": ["Nizamuddin", "Mayur Vihar", "Preet Vihar", "Geeta Colony"],
      "New Delhi": ["Connaught Place", "Lajpat Nagar", "Sarojini Nagar", "Chanakyapuri"],
      "North Delhi": ["Civil Lines", "Narela", "Sultan Puri", "Rohini"],
      "North East Delhi": ["Shahdara", "Seelampur", "Yamuna Vihar", "Nand Nagri"],
      "North West Delhi": ["Rohini", "Pitampura", "Narela", "Mundka"],
      "Shahdara": ["Shahdara", "Vivek Vihar", "Geeta Colony", "Krishna Nagar"],
      "South Delhi": ["Hauz Khas", "Saket", "Vasant Kunj", "Greater Kailash"],
      "South East Delhi": ["Nehru Place", "GK", "East of Kailash", "Amar Colony"],
      "South West Delhi": ["Dwarka", "Janakpuri", "Rajouri Garden", "Palam"],
      "West Delhi": ["Janakpuri", "Rajouri Garden", "Tilak Nagar", "Meera Bagh"]
    }
  },
  "Goa": {
    districts: {
      "North Goa": ["Panaji", "Mapusa", "Bicholim", "Pernem", "Satari", "Sattari"],
      "South Goa": ["Margao", "Vasco da Gama", "Quepem", "Curchorem", "Canacona", "Dharbandora"]
    }
  },
  "Gujarat": {
    districts: {
      "Ahmedabad": ["Ahmedabad", "Sanand", "Dholka", "Viramgam", "Detroj"],
      "Amreli": ["Amreli", "Rajula", "Savarkundla", "Babra", "Lathi"],
      "Anand": ["Anand", "Umreth", "Khambhat", "Borsad", "Petlad"],
      "Aravalli": ["Modasa", "Himatnagar", "Khedbrahma", "Dhansura", "Malpur"],
      "Banaskantha": ["Palanpur", "Deesa", "Tharad", "Kadi", "Vadgam"],
      "Bharuch": ["Bharuch", "Ankleshwar", "Jambusar", "Valia", "Jhagadia"],
      "Bhavnagar": ["Bhavnagar", "Talaja", "Mahuvar", "Gariadhar", "Palitana"],
      "Botad": ["Botad", "Gadhada", "Barwala", "Ranpur", "Mahuvar"],
      "Chhota Udaipur": ["Chhota Udaipur", "Sankheda", "Kavant", "Nasvadi"],
      "Dahod": ["Dahod", "Devgadh Baria", "Limkheda", "Fatepura", "Garbhan"],
      "Dang": ["Ahwa", "Waghai", "Subir", "Khapral", "Devgadh"],
      "Devbhumi Dwarka": ["Khambhal", "Dwarka", "Kalyanpur", "Mithapur"],
      "Gandhinagar": ["Gandhinagar", "Kalol", "Mansa", "Vijaynagar", "Dehgam"],
      "Gir Somnath": ["Veraval", "Una", "Kodinar", "Sutrapada", "Talala"],
      "Jamnagar": ["Jamnagar", "Dwarka", "Khambhal", "Okha", "Jodia"],
      "Junagadh": ["Junagadh", "Mangrol", "Keshod", "Visavadar", "Manavadar"],
      "Kheda": ["Nadiad", "Kapadvanj", "Mehmedabad", "Kathlal", "Matar"],
      "Kutch": ["Bhuj", "Mandvi", "Rapar", "Nakhatrana", "Anjar", "Gandhidham"],
      "Mahisagar": ["Lunawada", "Kadana", "Santrampur", "Viray", "Bouri"],
      "Mehsana": ["Mehsana", "Unjha", "Visnagar", "Kadi", "Kalol"],
      "Morbi": ["Morbi", "Tankara", "Wankaner", "Maliya", "Halvad"],
      "Narmada": ["Bharuch", "Narmada", "Rajpipla", "Dediapada", "Garudeshwar"],
      "Navsari": ["Navsari", "Valsad", "Chikhli", "Gandevi", "Jalalpore"],
      "Panchmahal": ["Godhra", "Halol", "Kalol", "Kadana", "Ghoghamba"],
      "Patan": ["Patan", "Sidhpur", "Chanasma", "Sami", "Kankrej"],
      "Porbandar": ["Porbandar", "Ranavav", "Kutiyana", "Khambhal"],
      "Rajkot": ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Upleta"],
      "Sabarkantha": ["Himatnagar", "Idar", "Prantij", "Khedbrahma", "Vadali"],
      "Surat": ["Surat", "Bardoli", "Mandvi", "Kamrej", "Olpad"],
      "Surendranagar": ["Surendranagar", "Wadhwan", "Halvad", "Limbdi", "Chotila"],
      "Tapi": ["Vyara", "Songadh", "Nizar", "Uchchhal", "Valod"],
      "Vadodara": ["Vadodara", "Anand", "Nadiad", "Borsad", "Petlad"],
      "Valsad": ["Valsad", "Vapi", "Navsari", "Dharampur", "Kaprada"]
    }
  },
  "Haryana": {
    districts: {
      "Ambala": ["Ambala", "Naraingarh", "Barara", "Saha", "Mulana"],
      "Bhiwani": ["Bhiwani", "Charkhi Dadri", "Loharu", "Siwani", "Tosham"],
      "Charkhi Dadri": ["Charkhi Dadri", "Badhra", "Bhiwani"],
      "Faridabad": ["Faridabad", "Ballabgarh", "Hathin", "Palwal"],
      "Fatehabad": ["Fatehabad", "Tohana", "Ratia", "Bhuna"],
      "Gurugram": ["Gurugram", "Manesar", "Pataudi", "Sohna", "Farrukhnagar"],
      "Hisar": ["Hisar", "Hanshi", "Adampur", "Narnaund", "Hansi"],
      "Jhajjar": ["Jhajjar", "Bahadurgarh", "Beri", "Ladrawan", "Salhawas"],
      "Jind": ["Jind", "Narwana", "Uchana", "Safidon", "Julana"],
      "Kaithal": ["Kaithal", "Assandh", "Pundri", "Cheeka", "Kaithal"],
      "Karnal": ["Karnal", "Panipat", "Nilokheri", "Indri", "Kunjpura"],
      "Kurukshetra": ["Kurukshetra", "Pehowa", "Shahabad", "Ladwa", "Thanesar"],
      "Mahendragarh": ["Narnaul", "Mahendragarh", "Nangal Chaudhary", "Kanina"],
      "Nuh": ["Nuh", "Ferozepur Jhirka", "Taoru", "Punahana", "Sohna"],
      "Palwal": ["Palwal", "Hathin", "Hodal", "Kritsar", "Baghol"],
      "Panchkula": ["Panchkula", "Kalka", "Pinjore", "Barwala", "Morni"],
      "Panipat": ["Panipat", "Israna", "Samalkha", "Krishnapur"],
      "Rewari": ["Rewari", "Bawal", "Kosli", "Jatusana", "Dharuhera"],
      "Rohtak": ["Rohtak", "Sampla", "Kalanaur", "Saharanpur", "Jhajjar"],
      "Sirsa": ["Sirsa", "Ellenabad", "Rania", "Kalanwali", "Dabwali"],
      "Sonipat": ["Sonipat", "Gohana", "Kharkhoda", "Ganaur", "Murthal"],
      "Yamunanagar": ["Yamunanagar", "Jagadhri", "Radaur", "Sadhaura", "Chhachhrauli"]
    }
  },
  "Himachal Pradesh": {
    districts: {
      "Bilaspur": ["Bilaspur", "Ghumarwin", "Bharari", "Namhol"],
      "Chamba": ["Chamba", "Tissa", "Bharmour", "Dalhousie", "Bhattiyat"],
      "Hamirpur": ["Hamirpur", "Barsar", "Bhota", "Nadah", "Galore"],
      "Kangra": ["Dharamshala", "Kangra", "Palampur", "Nurpur", "Chhawara"],
      "Kinnaur": ["Reckong Peo", "Kalpa", "Pooh", "Sangla", "Morang"],
      "Kullu": ["Kullu", "Manali", "Bhuntar", "Nagar", "Kothi"],
      "Lahaul and Spiti": ["Keylong", "Kaza", "Udaipur", "Spiti"],
      "Mandi": ["Mandi", "Karsog", "Sundernagar", "Balh", "Chachyot"],
      "Shimla": ["Shimla", "Kufri", "Chail", "Theog", "Rampura"],
      "Sirmaur": ["Nahan", "Paonta Sahib", "Rajgarh", "Shillai", "Kamrau"],
      "Solan": ["Solan", "Kasauli", "Nalagarh", "Baddi", "Kandaghat"],
      "Una": ["Una", "Bangana", "Ghurpur", "Bharwain", "Chintpurni"]
    }
  },
  "Jammu and Kashmir": {
    districts: {
      "Jammu": ["Jammu", "Akhnoor", "Bishna", "Ranbir Singh Pora", "Samba"],
      "Srinagar": ["Srinagar", "Ganderbal", "Pampore", "Budgam"],
      "Baramulla": ["Baramulla", "Kupwara", "Handwara", "Sopore"],
      "Anantnag": ["Anantnag", "Kulgam", "Pulwama", "Shopian"],
      "Kathua": ["Kathua", "Hiranagar", "Billawar", "Bani"],
      "Udhampur": ["Udhampur", "Chenani", "Ramnagar", "Gool"],
      "Poonch": ["Poonch", "Rajouri", "Surankote", "Mandi"],
      "Doda": ["Doda", "Kishtwar", "Ramban", "Bhaderwah"],
      "Reasi": ["Reasi", "Gool", "Panthalkot", "Arnas"],
      "Samba": ["Samba", "Vijaypur", "Purmandal", "Nagrota"],
      "Kulgam": ["Kulgam", "Devsar", "Dusso", "Rajpora"],
      "Pulwama": ["Pulwama", "Pampore", "Tullamulla", "Khansahib"],
      "Shopian": ["Shopian", "Heerpora", "Dusso", "Zainapora"],
      "Bandipora": ["Bandipora", "Gurez", "Tulail", "Khornora"],
      "Ganderbal": ["Ganderbal", "Srinagar", "Kangan", "Wakura"],
      "Budgam": ["Budgam", "Chrar-e-Sharif", "Beerwah", "Khan Sahib"]
    }
  },
  "Jharkhand": {
    districts: {
      "Bokaro": ["Bokaro Steel City", "Chas", "Jharia", "Gomia", "Petarwar"],
      "Chatra": ["Chatra", "Latehar", "Palkot", "Pradani"],
      "Deoghar": ["Deoghar", "Jasidih", "Devipur", "Madhupur"],
      "Dhanbad": ["Dhanbad", "Jharia", "Gobindpur", "Tundi", "Purbi Tundi"],
      "Dumka": ["Dumka", "Jamtara", "Shikaripara", "Raneshwar"],
      "East Singhbhum": ["Jamshedpur", "Ghatshila", "Chakulia", "Baharadila"],
      "Garhwa": ["Garhwa", "Ranchi", "Latehar", "Balumath"],
      "Giridih": ["Giridih", "Dhanbad", "Tisra", "Gomia"],
      "Godda": ["Godda", "Mahagama", "Poreyahat", "Sunderdhaka"],
      "Gumla": ["Gumla", "Ranchi", "Bishunpur", "Palkot"],
      "Hazaribagh": ["Hazaribagh", "Barkagaon", "Katkamsandi", "Churchu"],
      "Jamtara": ["Jamtara", "Dumka", "Nala", "Fatehpur"],
      "Khunti": ["Khunti", "Ranchi", "Tamar", "Mandar"],
      "Latehar": ["Latehar", "Garhwa", "Balumath", "Mahuatand"],
      "Lohardaga": ["Lohardaga", "Bhandra", "Kuru", "Kairo"],
      "Pakur": ["Pakur", "Dumka", "Shikaripara", "Hiranpur"],
      "Palamu": ["Palamu", "Garhwa", "Chhatarpur", "Lesliganj"],
      "Ramgarh": ["Ramgarh", "Hazaribagh", "Mandu", "Chitarpur"],
      "Ranchi": ["Ranchi", "Khunti", "Bundu", "Tamar"],
      "Sahibganj": ["Sahibganj", "Rajmahal", "Borio", "Talisudhipara"],
      "Seraikela Kharsawan": ["Seraikela", "Kharsawan", "Kuchai", "Ichagarh"],
      "Simdega": ["Simdega", "Gumla", "Kolebira", "Bano"],
      "West Singhbhum": ["Chaibasa", "Jamshedpur", "Chakulia", "Baharadila"]
    }
  },
  "Karnataka": {
    districts: {
      "Bagalkot": ["Bagalkot", "Badami", "Hungund", "Mudhol", "Jamkhandi"],
      "Bangalore Rural": ["Devanahalli", "Nelamangala", "Dodballapur", "Hosakote"],
      "Bangalore Urban": ["Bangalore", "Yelahanka", "Whitefield", "Kengeri", "Electronic City"],
      "Belagavi": ["Belagavi", "Athani", "Chikodi", "Gokak", "Hukkeri"],
      "Bellary": ["Bellary", "Hospet", "Sandur", "Siruguppa", "Kudligi"],
      "Bidar": ["Bidar", "Aurad", "Chitgoppa", "Humnabad", "Kamalanagar"],
      "Chikkaballapur": ["Chikkaballapur", "Bagepalli", "Chintamani", "Gauribidanur", "Sidlaghatta"],
      "Chikkamagaluru": ["Chikkamagaluru", "Kadur", "Tarikere", "Koppa", "Mudigere"],
      "Chitradurga": ["Chitradurga", "Hiriyur", "Challakere", "Holalkere", "Hosdurga"],
      "Dakshina Kannada": ["Mangalore", "Surathkal", "Puttur", "Bantwal", "Moodbidri"],
      "Davanagere": ["Davanagere", "Harpanahalli", "Jagalur", "Honnali", "Nyamati"],
      "Dharwad": ["Dharwad", "Hubli", "Kalghatgi", "Kundgol", "Navalgund"],
      "Gadag": ["Gadag", "Ron", "Nargund", "Shirhatti", "Mundargi"],
      "Gulbarga": ["Gulbarga", "Yadgir", "Chitapur", "Sedam", "Jewargi"],
      "Hassan": ["Hassan", "Arsikere", "Belur", "Holenarasipura", "Sakleshpura"],
      "Haveri": ["Haveri", "Byadgi", "Hangal", "Savanur", "Ranibennur"],
      "Hubli": ["Hubli", "Dharwad", "Kalghatgi", "Kundgol", "Navalgund"],
      "Kalaburagi": ["Kalaburagi", "Afzalpur", "Aland", "Chincholi", "Jevargi"],
      "Udupi": ["Udupi", "Karkala", "Puttur", "Kundapur", "Brahmavar"],
      "Uttara Kannada": ["Karwar", "Dandeli", "Sirsi", "Honnavar", "Kumta"],
      "Vijayapura": ["Vijayapura", "Indi", "Sindagi", "Basavan Bagewadi", "Muddebihal"],
      "Yadgir": ["Yadgir", "Shahpur", "Shorapur", "Yelburga"]
    }
  },
  "Kerala": {
    districts: {
      "Alappuzha": ["Alappuzha", "Cherthala", "Kottayam", "Mavelikkara", "Chengannur"],
      "Ernakulam": ["Kochi", "Aluva", "Perumbavoor", "Kothamangalam", "Moovattupuzha"],
      "Idukki": ["Thodupuzha", "Munnar", "Kattappana", "Nedumkandam", "Devikulam"],
      "Kannur": ["Kannur", "Thalassery", "Kasaragod", "Payyanur", "Kannapuram"],
      "Kasaragod": ["Kasaragod", "Kannur", "Uppala", "Kumta", "Mangalore"],
      "Kollam": ["Kollam", "Punalur", "Karunagappally", "Kottarakkara", "Oachira"],
      "Kottayam": ["Kottayam", "Pala", "Changanassery", "Vaikom", "Kanjirappally"],
      "Kozhikode": ["Kozhikode", "Vadakara", "Quilandy", "Thamarassery", "Balussery"],
      "Malappuram": ["Malappuram", "Perinthalmanna", "Tirur", "Ponnani", "Kottakkal"],
      "Palakkad": ["Palakkad", "Ottapalam", "Mannarkkad", "Chittur", "Alathur"],
      "Pathanamthitta": ["Pathanamthitta", "Adoor", "Thiruvalla", "Kumbanad", "Ranni"],
      "Thiruvananthapuram": ["Thiruvananthapuram", "Neyyattinkara", "Varkala", "Attingal", "Kollayil"],
      "Thrissur": ["Thrissur", "Kodungallur", "Chalakudy", "Irinjalakuda", "Kunnamkulam"],
      "Wayanad": ["Kalpetta", "Sultan Bathery", "Mananthavady", "Vythiri", "Meppadi"]
    }
  },
  "Ladakh": {
    districts: {
      "Kargil": ["Kargil", "Zanskar", "Suru", "Sham", "Taisuru"],
      "Leh": ["Leh", "Kargil", "Nubra", "Zanskar", "Sham"]
    }
  },
  "Lakshadweep": {
    districts: {
      "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Andrott", "Kalpeni"]
    }
  },
  "Madhya Pradesh": {
    districts: {
      "Agar Malwa": ["Agar", "Malwa", "Nalkheda", "Susner"],
      "Alirajpur": ["Alirajpur", "Jobat", "Bhavra", "Katkai"],
      "Anuppur": ["Anuppur", "Kotma", "Jaithari", "Pushprajgarh"],
      "Ashoknagar": ["Ashoknagar", "Chanderi", "Mungaoli", "Shadhora"],
      "Balaghat": ["Balaghat", "Wara Seoni", "Lanji", "Kirnapur"],
      "Bhopal": ["Bhopal", "Berasia", "Phanda", "Huzur"],
      "Burhanpur": ["Burhanpur", "Nepanagar", "Khaknar", "Roshni"],
      "Chhatarpur": ["Chhatarpur", "Saugor", "Bina", "Rahatgarh"],
      "Chhindwara": ["Chhindwara", "Pandhurna", "Amarwara", "Sausar"],
      "Damoh": ["Damoh", "Jabalpur", "Hatta", "Patera"],
      "Datia": ["Datia", "Seondha", "Bhelsar", "Naya Kheda"],
      "Dewas": ["Dewas", "Sonkatch", "Bagli", "Kannod"],
      "Dhar": ["Dhar", "Manawar", "Sardarpur", "Dharampuri"],
      "Dindori": ["Dindori", "Mandla", "Nainpur", "Bichiya"],
      "East Nimar": ["Khandwa", "Khargone", "Burhanpur", "Nimar"],
      "Guna": ["Guna", "Bamori", "Kanch", "Maksood"],
      "Gwalior": ["Gwalior", "Morar", "Dabra", "Bhitarwar"],
      "Harda": ["Harda", "Timarni", "Pipariya", "Khirkiya"],
      "Hoshangabad": ["Hoshangabad", "Narmadapuram", "Itarsi", "Seoni-Malwa"],
      "Indore": ["Indore", "Mhow", "Depalpur", "Sanwer"],
      "Jabalpur": ["Jabalpur", "Sihora", "Kundam", "Patan"],
      "Jhabua": ["Jhabua", "Thandla", "Petlawad", "Meghnagar"],
      "Katni": ["Katni", "Vijayraghavgarh", "Rithi", "Badwara"],
      "Khargone": ["Khargone", "Barwaha", "Kasrawad", "Bhagwanpura"],
      "Mandla": ["Mandla", "Nainpur", "Bichiya", "Maharajpur"],
      "Mandsaur": ["Mandsaur", "Narayanganj", "Mandsaur", "Suwasra"],
      "Morena": ["Morena", "Ambah", "Joura", "Kailaras"],
      "Narsinghpur": ["Narsinghpur", "Gadarwara", "Kareli", "Tendu"],
      "Neemuch": ["Neemuch", "Jawad", "Kukreshwar", "Manasa"],
      "Niwari": ["Niwari", "Orchha", "Jatara", "Prithvipur"],
      "Panna": ["Panna", "Ajaygarh", "Gunnore", "Shahgarh"],
      "Raisen": ["Raisen", "Begamganj", "Gulabganj", "Sanchi"],
      "Rajgarh": ["Rajgarh", "Biaora", "Narsinghgarh", "Sarangpur"],
      "Ratlam": ["Ratlam", "Jaora", "Alote", "Bajna"],
      "Rewa": ["Rewa", "Gangeo", "Mauganj", "Hanumana"],
      "Sagar": ["Sagar", "Rahatgarh", "Khurai", "Bina"],
      "Satna": ["Satna", "Nagod", "Maihar", "Amarpatan"],
      "Sehore": ["Sehore", "Ashta", "Nasrullaganj", "Budni"],
      "Seoni": ["Seoni", "Lakhnadon", "Ghansore", "Kuras"],
      "Shahdol": ["Shahdol", "Beohari", "Jaisinghnagar", "Ghohtaki"],
      "Shajapur": ["Shajapur", "Shujalpur", "Aron", "Kalapipal"],
      "Sheopur": ["Sheopur", "Vijaypur", "Bagdin", "Malhar"],
      "Shivpuri": ["Shivpuri", "Pohri", "Kolaras", "Badarwas"],
      "Sidhi": ["Sidhi", "Churhat", "Gopadbanas", "Masiana"],
      "Singrauli": ["Singrauli", "Waidhan", "Chitrangi", "Deosar"],
      "Tikamgarh": ["Tikamgarh", "Jatara", "Palera", "Baldeogarh"],
      "Ujjain": ["Ujjain", "Nagda", "Tarana", "Badnagar"],
      "Umaria": ["Umaria", "Bandhavgarh", "Pali", "Manpur"],
      "Vidisha": ["Vidisha", "Nateran", "Sironj", "Kurwai"],
      "West Nimar": ["Khandwa", "Burhanpur", "Khargone", "Pandhana"]
    }
  },
  "Maharashtra": {
    districts: {
      "Ahmednagar": ["Ahmednagar", "Shirdi", "Sangamner", "Kopargaon", "Rahata"],
      "Akola": ["Akola", "Washim", "Murtizapur", "Barshitakli", "Akot"],
      "Amravati": ["Amravati", "Badnagar", "Achalpur", "Warud", "Dharni"],
      "Aurangabad": ["Aurangabad", "Jalna", "Paithan", "Gangapur", "Vaijapur"],
      "Beed": ["Beed", "Ambejogai", "Parli", "Majalgaon", "Georai"],
      "Bhandara": ["Bhandara", "Tumsak", "Sakoli", "Lakhandur", "Mohadi"],
      "Bid": ["Beed", "Majalgaon", "Parli", "Ambejogai", "Patoda"],
      "Buldhana": ["Buldhana", "Jalgaon", "Sindkhed Raja", "Khamgaon", "Malkapur"],
      "Chandrapur": ["Chandrapur", "Ballarpur", "Warora", "Chimur", "Bhadravati"],
      "Dhule": ["Dhule", "Sakri", "Shirpur", "Dhadgoan", "Nimzari"],
      "Gadchiroli": ["Gadchiroli", "Armori", "Aheri", "Sironcha", "Dhanora"],
      "Gondia": ["Gondia", "Tiroda", "Arjuni Morgaon", "Goregaon", "Amgaon"],
      "Hingoli": ["Hingoli", "Basmath", "Kalamnuri", "Sengaon", "Aundha Nagnath"],
      "Jalgaon": ["Jalgaon", "Bhusawal", "Amalner", "Pachora", "Erandol"],
      "Jalna": ["Jalna", "Ambad", "Badnapur", "Bhokardan", "Jaffrabad"],
      "Kolhapur": ["Kolhapur", "Sangli", "Karad", "Ichalkaranji", "Panhala"],
      "Latur": ["Latur", "Udgir", "Ausa", "Nilanga", "Deoni"],
      "Mumbai City": ["Mumbai"],
      "Mumbai Suburban": ["Andheri", "Borivali", "Kurla", "Bandra", "Mulund"],
      "Nagpur": ["Nagpur", "Ramtek", "Hingna", "Umred", "Katol"],
      "Nanded": ["Nanded", "Loha", "Bhokar", "Mudkhed", "Kandhar"],
      "Nandurbar": ["Nandurbar", "Shahada", "Toralpur", "Navapur", "Nandurbar"],
      "Nashik": ["Nashik", "Malegaon", "Sinnar", "Igatpuri", "Satana"],
      "Osmanabad": ["Osmanabad", "Tuljapur", "Omerga", "Kalamb", "Bhum"],
      "Palghar": ["Palghar", "Vasai", "Virar", "Thane", "Dahanu"],
      "Parbhani": ["Parbhani", "Gangakhed", "Palam", "Jintur", "Sonpeth"],
      "Pune": ["Pune", "Hinjewadi", "Shivajinagar", "Kothrud", "Hadapsar"],
      "Raigad": ["Alibag", "Panvel", "Karjat", "Khalapur", "Uran"],
      "Ratnagiri": ["Ratnagiri", "Chiplun", "Rajapur", "Lanja", "Devgad"],
      "Sangli": ["Sangli", "Miraj", "Tasgaon", "Kavathemahankal", "Valva"],
      "Satara": ["Satara", "Karad", "Wai", "Mahabaleshwar", "Phaltan"],
      "Sindhudurg": ["Sindhudurg", "Kankavli", "Kudal", "Vengurla", "Malvan"],
      "Solapur": ["Solapur", "Pandharpur", "Barshi", "Mangalwedha", "Karmala"],
      "Thane": ["Thane", "Kalyan", "Ulhasnagar", "Mira Bhayandar", "Vasai"],
      "Wardha": ["Wardha", "Hinganghat", "Arvi", "Seloo", "Deoli"],
      "Washim": ["Washim", "Akola", "Murtizapur", "Risod", "Karanja"],
      "Yavatmal": ["Yavatmal", "Pusad", "Umarkhed", "Wani", "Digras"]
    }
  },
  "Manipur": {
    districts: {
      "Bishnupur": ["Bishnupur", "Moirang", "Kakching", "Lamjaotongba"],
      "Chandel": ["Chandel", "Churachandpur", "Moreh", "Mao"],
      "Churachandpur": ["Churachandpur", "Lamka", "Singngat", "Henglep"],
      "Imphal East": ["Imphal", "Jiribam", "Porompat", "Keirao Bitra"],
      "Imphal West": ["Imphal", "Lamphel", "Sagang", "Wangoi"],
      "Jiribam": ["Jiribam", "Borobekra", "Ccpur"],
      "Kakching": ["Kakching", "Moirang", "Churachandpur"],
      "Kamjong": ["Kamjong", "Kasom Khullen", "Khabung", "Phungyar"],
      "Kangpokpi": ["Kangpokpi", "Saitu", "Tamei", "Tamenglong"],
      "Noney": ["Noney", "Longmai", "Pherzawl"],
      "Pherzawl": ["Pherzawl", "Bunglon", "Tippie"],
      "Senapati": ["Senapati", "Mao", "Maram", "Purul"],
      "Tamenglong": ["Tamenglong", "Tamenlong", "Noney", "Khoupum"],
      "Tengnoupal": ["Tengnoupal", "Moreh", "Chandel"],
      "Thoubal": ["Thoubal", "Lilong", "Heirok", "Wabagai"],
      "Ukhrul": ["Ukhrul", "Kamjong", "Phungyar", "Lungchian"]
    }
  },
  "Meghalaya": {
    districts: {
      "East Garo Hills": ["Williamnagar", "Resubelpara", "Kharkutta", "Dambo Rongjeng"],
      "East Jaintia Hills": ["Khliehriat", "Jowai", "Laskhem", "Sutnga"],
      "East Khasi Hills": ["Shillong", "Mawkyrwat", "Sohra", "Cherrapunji"],
      "North Garo Hills": ["Resubelpara", "Bajengdoba", "Kharkutta"],
      "Ri Bhoi": ["Nongpoh", "Jirang", "Umsning", "Byrnihat"],
      "South Garo Hills": ["Baghmara", "Rongara", "Chokpot", "Gambegre"],
      "South West Garo Hills": ["Ampati", "Dadenggiri", "Tikrikilla", "Zikzak"],
      "South West Khasi Hills": ["Mawkyrwat", "Mawshynrut", "Nongstoin"],
      "West Garo Hills": ["Tura", "Tura", "Dalu", "Mendipathar"],
      "West Jaintia Hills": ["Jowai", "Amlarem", "Thadlaskein", "Laskein"],
      "West Khasi Hills": ["Nongstoin", "Mairang", "Mawshynrut", "Nongspung"]
    }
  },
  "Mizoram": {
    districts: {
      "Aizawl": ["Aizawl", "Tlangnuam", "Darlawn", "Phullen", "Chawilung"],
      "Champhai": ["Champhai", "Khawzawl", "Ngopa", "Chhakchhuak"],
      "Hnahthial": ["Hnahthial", "Lungsen", "Dlungtung"],
      "Kolasib": ["Kolasib", "Bilkhawthlir", "Vairengte", "Kawnpui"],
      "Lawngtlai": ["Lawngtlai", "Chawngte", "Sangau", "Bolunge"],
      "Lunglei": ["Lunglei", "Hnahthial", "Tlabung", "Zodin"],
      "Mamit": ["Mamit", "Kawrthah", "Zawlnuam", "Reiek"],
      "Saiha": ["Saiha", "Tuipang", "Molaith", "Sialsuk"],
      "Saitual": ["Saitual", "Phullen", "Zemabawk", "Aizawl"],
      "Serchhip": ["Serchhip", "Thenzawl", "E Lung", "Bak Swn"]
    }
  },
  "Nagaland": {
    districts: {
      "Dimapur": ["Dimapur", "Niuland", "Kuhuboto", "Chumukedima"],
      "Kiphire": ["Kiphire", "Pungro", "Khonoma", "Sitimi"],
      "Kohima": ["Kohima", "Viswema", "Jakhama", "Chobama"],
      "Longleng": ["Longleng", "Manyak", "Tamlu", "Naga"],
      "Mokokchung": ["Mokokchung", "Tuli", "Changtongya", "Longkhim"],
      "Mon": ["Mon", "Tizit", "Wakching", "Phomching"],
      "Noklak": ["Noklak", "Pangsha", "Tsuny", "Noklak"],
      "Peren": ["Peren", "Jalukie", "Pherima", "Athibung"],
      "Phek": ["Phek", "Meluri", "Kiphire", "Pfutsero"],
      "Tuensang": ["Tuensang", "Mon", "Noklak", "Shamator"],
      "Wokha": ["Wokha", "LakshUM", "Bhandari", "Sanis"],
      "Zunheboto": ["Zunheboto", "Atoizu", "Aghunato", "Pughoboto"]
    }
  },
  "Odisha": {
    districts: {
      "Angul": ["Angul", "Talcher", "Dhenkanal", "Athmallik", "Banarpal"],
      "Balangir": ["Balangir", "Titlagarh", "Kantabanji", "Sonepur", "Loisinga"],
      "Balasore": ["Balasore", "Bhadrak", "Jaleswar", "Soro", "Nilgiri"],
      "Bargarh": ["Bargarh", "Sambalpur", "Padampur", "Paikmal", "Soochak"],
      "Bhadrak": ["Bhadrak", "Chandabali", "Basudevpur", "Dhamanagar"],
      "Boudh": ["Boudh", "Kantamal", "Puran", "Harbhanga"],
      "Cuttack": ["Cuttack", "Bhubaneswar", "Jajpur", "Kendrapara", "Jagatpur"],
      "Deogarh": ["Deogarh", "Rourkela", "Laikera", "Kochinda"],
      "Dhenkanal": ["Dhenkanal", "Kamakshyanagar", "Parjanga", "Hindol"],
      "Gajapati": ["Parlakhemundi", "Mohana", "R.Udayagiri", "Kashinagar"],
      "Ganjam": ["Berhampur", "Chatrapur", "Aska", "Hinjili", "Kallada"],
      "Jagatsinghpur": ["Jagatsinghpur", "Paradip", "Kujang", "Raghunathpur"],
      "Jajpur": ["Jajpur Road", "Panikoili", "Dharmasala", "Binjharpur"],
      "Jharsuguda": ["Jharsuguda", "Laikera", "Kolabira", "Rourkela"],
      "Kalahandi": ["Bhawanipatna", "Karlamunda", "Kesinga", "Lanjigarh", "M Rampur"],
      "Kandhamal": ["Phulbani", "Baliguda", "G. Udayagiri", "Daringbadi", "Tumudibandh"],
      "Kendrapara": ["Kendrapara", "Rajkanika", "Aul", "Patkura", "Marshaghai"],
      "Kendujhar": ["Kendujhar", "Keonjhar", "Anandapur", "Champua", "Ghasipura"],
      "Khordha": ["Bhubaneswar", "Cuttack", "Jatani", "Balugaon", "Banapur"],
      "Koraput": ["Koraput", "Jeypore", "Sunabeda", "Laxmipur", "Koraput"],
      "Malkangiri": ["Malkangiri", "Mathalput", "Korkunda", "Chitrakonda"],
      "Mayurbhanj": ["Baripada", "Karanjia", "Rairangpur", "Udala", "Betanati"],
      "Nabarangpur": ["Nabarangpur", "Jeypore", "Daikaband", "Kosagumuda", "Papadahandi"],
      "Nayagarh": ["Nayagarh", "Khandapada", "Fategarh", "Dasarathpur", "Odagaon"],
      "Nuapada": ["Nuapada", "Khariar", "Komna", "Sinapali", "Boden"],
      "Puri": ["Puri", "Konark", "Satyabadi", "Gadisagada", "Brahmagiri"],
      "Rayagada": ["Rayagada", "Gunupur", "Bisam Cuttack", "Kashipur", "Padmapur"],
      "Sambalpur": ["Sambalpur", "Rourkela", "Jharsuguda", "Kuchinda", "Biramitra"],
      "Subarnapur": ["Subarnapur", "Birmahasresh", "J教条", "Dunguripalli", "Kendumdih"],
      "Sundargarh": ["Sundargarh", "Rourkela", "Jharsuguda", "Biramahasresh", "Kuanrmunda"]
    }
  },
  "Puducherry": {
    districts: {
      "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"],
      "Karaikal": ["Karaikal", "Nallambal", "Kottakuppam"],
      "Mahe": ["Mahe", "K千里"],
      "Yanam": ["Yanam"]
    }
  },
  "Punjab": {
    districts: {
      "Amritsar": ["Amritsar", "Ajnala", "Attari", "Baba Bakala", "Harsha"],
      "Barnala": ["Barnala", "Dhanaula", "Moga", "Phagwara"],
      "Bathinda": ["Bathinda", "Mansa", "Sangat", "Talwandi Sabo"],
      "Faridkot": ["Faridkot", "Jaito", "Kotkapura", "Rampura"],
      "Fatehgarh Sahib": ["Fatehgarh Sahib", "Mandi Gobindgarh", "Amloh", "Khamano"],
      "Fazilka": ["Fazilka", "Abohar", "Jalalabad", "Khuian Sarwar"],
      "Ferozepur": ["Ferozepur", "Moga", "Jalalabad", "Fazilka"],
      "Gurdaspur": ["Gurdaspur", "Pathankot", "Dinanagar", "Batala"],
      "Hoshiarpur": ["Hoshiarpur", "Garhshankar", "Mukerian", "Dasua"],
      "Jalandhar": ["Jalandhar", "Nakodar", "Phagwara", "Shahkot"],
      "Kapurthala": ["Kapurthala", "Phagwara", "Bholath", "Sultanpur Lodhi"],
      "Ludhiana": ["Ludhiana", "Jagraon", "Khanna", "Samrala", "Moga"],
      "Mansa": ["Mansa", "Budhlada", "Sardulgarh", "Joga"],
      "Moga": ["Moga", "Fatehgarh Sahib", "Moga", "Nihal Singh Wala"],
      "Pathankot": ["Pathankot", "Gurdaspur", "Dalhousie", "Madhopur"],
      "Patiala": ["Patiala", "Rajpura", "Samana", "Nabha"],
      "Rupnagar": ["Rupnagar", "Anandpur Sahib", "Kharar", "Morinda"],
      "Sahibzada Ajit Singh Nagar": ["Mohali", "Kharar", "Zirakpur", "Dera Bassi"],
      "Sangrur": ["Sangrur", "Malerkotla", "Dhuri", "Sunam"],
      "Shaheed Bhagat Singh Nagar": ["Nawanshahr", "Balachaur", "Saroya", "Mehdipur"],
      "Sri Muktsar Sahib": ["Muktsar", "Kot Bhai", "Lambi", "Guru Sahib"],
      "Tarn Taran": ["Tarn Taran", "Khadki", "Patti", "Valtoha"]
    }
  },
  "Rajasthan": {
    districts: {
      "Ajmer": ["Ajmer", "Kishangarh", "Beawar", "Nasirabad", "Kekri"],
      "Alwar": ["Alwar", "Behror", "Neemrana", "Tijara", "Ramgarh"],
      "Anupgarh": ["Anupgarh", "Gharsana", "Rawatsar", "Karanpur"],
      "Banswara": ["Banswara", "Kushalgarh", "Gangadt", "Bagidora"],
      "Baran": ["Baran", "Kota", "Kherliganj", "Mangrol"],
      "Barmer": ["Barmer", "Balotra", "Siwana", "Gudamalani", "Chohtan"],
      "Bharatpur": ["Bharatpur", "Deeg", "Kumher", "Nadbai", "Weir"],
      "Bhilwara": ["Bhilwara", "Mandal", "Asind", "Beejoliya", "Kareda"],
      "Bikaner": ["Bikaner", "Nokha", "Lunkaransar", "Kolayat", "Khajuwala"],
      "Bundi": ["Bundi", "Indragarh", "Keshoraipatan", "Nainwa"],
      "Chittorgarh": ["Chittorgarh", "Nimbahera", "Begun", "Kapasan"],
      "Churu": ["Churu", "Ratangarh", "Sujangarh", "Taranagar"],
      "Dausa": ["Dausa", "Bandikui", "Mahwa", "Lalsot"],
      "Dholpur": ["Dholpur", "Bari", "Rajakhera", "Sabauli"],
      "Dungarpur": ["Dungarpur", "Aspur", "Sagwara", "Dungarpur"],
      "Hanumangarh": ["Hanumangarh", "Nohar", "Rawatsar", "Bhadra"],
      "Jaipur": ["Jaipur", "Ajmer", "Alwar", "Dausa", "Sanganer"],
      "Jaisalmer": ["Jaisalmer", "Pokaran", "Fatehgarh", "Sam"],
      "Jalore": ["Jalore", "Sanchore", "Ahore", "Jalor"],
      "Jhalawar": ["Jhalawar", "Jhalrapatan", "Pachpahar", "Khanpur"],
      "Jhunjhunu": ["Jhunjhunu", "Nawalgarh", "Sikar", "Chirawa"],
      "Jodhpur": ["Jodhpur", "Pali", "Balotra", "Phalodi", "Osian"],
      "Karauli": ["Karauli", "Todabhim", "Hindaun", "Nadbai"],
      "Kota": ["Kota", "Bundi", "Ramganj Mandi", "Sangod"],
      "Nagaur": ["Nagaur", "Merta City", "Kuchaman City", "Nawan", "Ladnun"],
      "Pali": ["Pali", "Marwar Junction", "Balotra", "Sojat"],
      "Pratapgarh": ["Pratapgarh", "Chhoti Sadri", "Peepalkhoont", "Arnod"],
      "Rajsamand": ["Rajsamand", "Nathdwara", "Kumbhalgarh", "Railmagra"],
      "Sawai Madhopur": ["Sawai Madhopur", "Bamanwas", "Karauli", "Chauth Ka Barwada"],
      "Sikar": ["Sikar", "Fatehpur", "Lachhmangarh", "Neem Ka Thana"],
      "Sirohi": ["Sirohi", "Pindwara", "Abu Road", "Sheoganj"],
      "Sri Ganganagar": ["Sri Ganganagar", "Hanumangarh", "Rawatsar", "Karanpur", "Raisinghnagar", "Anupgarh", "Vijaypur"],
      "Tonk": ["Tonk", "Uniara", "Malpura", "Nadoti"],
      "Udaipur": ["Udaipur", "Mavli", "Vallabhnagar", "Salumber"]
    }
  },
  "Sikkim": {
    districts: {
      "East Sikkim": ["Gangtok", "Rangpo", "Singtam", "Namchi", "Majitar"],
      "North Sikkim": ["Mangan", "Chungthang", "Lachung", "Dzongu"],
      "South Sikkim": ["Namchi", "Ravangla", "Jorethang", "Gyalshing"],
      "West Sikkim": ["Gyalshing", "Pelling", "Soreng", "Yuksom"]
    }
  },
  "Tamil Nadu": {
    districts: {
      "Ariyalur": ["Ariyalur", "Jayankondam", "Tirumanur", "Udhangudi"],
      "Chengalpattu": ["Chengalpattu", "Kanchipuram", "Sriperumbudur", "Mahabalipuram"],
      "Chennai": ["Chennai", "Tondiarpet", "Perambur", "Anna Nagar", "T. Nagar"],
      "Coimbatore": ["Coimbatore", "Mettupalayam", "Pollachi", "Udumalaipettai", "Valparai"],
      "Cuddalore": ["Cuddalore", "Chidambaram", "Neyveli", "Virudhachalam", "Panruti"],
      "Dharmapuri": ["Dharmapuri", "Palacode", "Pennagaram", "Harur", "Pappireddipatti"],
      "Dindigul": ["Dindigul", "Kodaikanal", "Palani", "Oddanchatram", "Vedasandur"],
      "Erode": ["Erode", "Bhavani", "Gobichettipalayam", "Sathyamangalam", "Perundurai"],
      "Kallakurichi": ["Kallakurichi", "Sankarankovil", "Tirukkoyilur", "Ulundurpettai"],
      "Kanchipuram": ["Kanchipuram", "Sriperumbudur", "Walajabad", "Uthiramerur", "Kanchipuram"],
      "Kanyakumari": ["Nagercoil", "Kanyakumari", "Colachel", "Padmanabhapuram"],
      "Karur": ["Karur", "Krishnarayapuram", "Kadavur", "Manmangalore"],
      "Krishnagiri": ["Krishnagiri", "Hosur", "Dharmapuri", "Uthangarai", "Shoolagiri"],
      "Madurai": ["Madurai", "Usilampatti", "Melur", "Peraiyur", "Thirumangalam"],
      "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Tharangambadi", "Kumbakonam"],
      "Nagapattinam": ["Nagapattinam", "Velankanni", "Kilvelur", "Thirukkuvalai"],
      "Namakkal": ["Namakkal", "Paramathi Velur", "Rasipuram", "Tiruchengode"],
      "Nilgiris": ["Udhagamandalam", "Coonoor", "Kotagiri", "Gudalur", "Wynad"],
      "Perambalur": ["Perambalur", "Kunnam", "Ariyalur", "Varadarajanpettai"],
      "Pudukkottai": ["Pudukkottai", "Aranthangi", "Kumbakonam", "Thirukattupalli"],
      "Ramanathapuram": ["Ramanathapuram", "Mullaitivu", "Kumbakonam", "Rameswaram"],
      "Ranipet": ["Ranipet", "Arcot", "Walajapet", "Sholingur", "Kaveripakkam"],
      "Salem": ["Salem", "Attur", "Mettur", "Namakkal", "Omalur"],
      "Sivaganga": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Tirupathur"],
      "Tenkasi": ["Tenkasi", "Kadayanallur", "Alangulam", "Vikramasingapuram"],
      "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Orathanadu"],
      "Theni": ["Theni", "Bodinayakanur", "Cumbum", "Andipatti"],
      "Thoothukudi": ["Thoothukudi", "Tiruchendur", "Kovilpatti", "Srivaikuntam"],
      "Tiruchirappalli": ["Tiruchirappalli", "Thuraiyur", "Lalgudi", "Manachanellur"],
      "Tirunelveli": ["Tirunelveli", "Ambasamudram", "Nanguneri", "Thisayanvilai"],
      "Tirupattur": ["Tirupattur", "Vaniyambadi", "Ambur", "Jolarpet"],
      "Tiruppur": ["Tiruppur", "Ukkadam", "Avinashi", "Palladam", "Dharapuram"],
      "Tiruvallur": ["Tiruvallur", "Tiruttani", "Poonamallee", "Kattankolathur"],
      "Tiruvannamalai": ["Tiruvannamalai", "Arni", "Cheyyar", "Polur", "Chengam"],
      "Tiruvarur": ["Tiruvarur", "Kumbakonam", "Nannilam", "Valangaiman"],
      "Vellore": ["Vellore", "Gudiyatham", "Abtc", "Anaikattu", "Kaveripakkam"],
      "Viluppuram": ["Viluppuram", "Tindivanam", "Gingee", "Tirukkoyilur"],
      "Virudhunagar": ["Virudhunagar", "Srivilliputhur", "Rajapalayam", "Sattur"]
    }
  },
  "Telangana": {
    districts: {
      "Adilabad": ["Adilabad", "Nirmal", "Kagaznagar", "Mancherial", "Bellampalli"],
      "B. Kothakota": ["B. Kothakota", "Gadwal", "Wanaparthy", "Kothakota"],
      "Hyderabad": ["Hyderabad", "Secunderabad", "Charminar", "Golnaka", "Falaknuma"],
      "Jagtial": ["Jagtial", "Metpalle", "Korutla", "Jagtial Rural"],
      "Jangaon": ["Jangaon", "Warangal", "Zari Wasan", "Lashkargund"],
      "Jayashankar Bhupalpally": ["Bhupalpally", "Jangalore", "Mohammedabad", "Gampalpahad"],
      "Jogulamba Gadwal": ["Gadwal", "Wanaparthy", "Kollapur", "Itikyala"],
      "Kamareddy": ["Kamareddy", "Nizamabad", "Banswada", "Yellareddy"],
      "Karimnagar": ["Karimnagar", "Huzurabad", "Manakondur", "Gangadhara"],
      "Khammam": ["Khammam", "Kothagudem", "Palwancha", "Madhira", "Sathupalle"],
      "Mahabubnagar": ["Mahabubnagar", "Jadcherla", "Narayanpet", "Kollapur"],
      "Mahabubabad": ["Mahabubabad", "Kesamudram", "Narsampet", "Garla"],
      "Mancherial": ["Mancherial", "Bellampalli", "Mandamarri", "Naspur"],
      "Medchal–Malkajgiri": ["Medchal", "Malkajgiri", "Keesara", "Qutubullapur"],
      "Medak": ["Medak", "Siddipet", "Dubbak", "Tuljapur", "Narsapur", "Papannapet"],
      "Nagarkurnool": ["Nagarkurnool", "Achampet", "Kalvakurthy", "Tadoor"],
      "Nalgonda": ["Nalgonda", "Suryapet", "Miryalaguda", "Bhongir", "Devarkonda"],
      "Narayanpet": ["Narayanpet", "Mahabubnagar", "Kollapur", "Damargidda"],
      "Nizamabad": ["Nizamabad", "Kamareddy", "Armur", "Bodhan", "Balkonda"],
      "Peddapalli": ["Peddapalli", "Mancherial", "Srirampur", "Ramagundam"],
      "Rangareddy": ["Rangareddy", "Shamshabad", "Ibrahimpatnam", "Kandukur"],
      "Sangareddy": ["Sangareddy", "Patancheru", "Ameenpur", "Jinnaram"],
      "Secunderabad": ["Secunderabad", "Hyderabad", "Koti", "Bolarum"],
      "Siddipet": ["Siddipet", "Medak", "Dubbak", "Gajwel"],
      "Sircilla": ["Sircilla", "Kamalapuram", "Saidapur", "Maddur"],
      "Suryapet": ["Suryapet", "Nalgonda", "Kodad", "Huzurnagar", "Thirumalagiri"],
      "Vikarabad": ["Vikarabad", "Tandur", "Banswada", "Kotagiri"],
      "Wanaparthy": ["Wanaparthy", "Gadwal", "Kollapur", "Pebbair"],
      "Warangal": ["Warangal", "Hanmakonda", "Kazipet", "Jangaon"],
      "Warangal Rural": ["Warangal Rural", "Parkal", "Narsampet", "Sangem"],
      "Yadadri Bhuvanagiri": ["Bhuvanagiri", "Choutuppal", "Nalgonda", "Mominpet"]
    }
  },
  "Tripura": {
    districts: {
      "Dhalai": ["Dhalai", "Kailashahar", "Dharmanagar", "Kumarghat"],
      "Gomati": ["Udaipur", "Amarpur", "Kakraban", "Matri"],
      "Khowai": ["Khowai", "Teliamura", "Bishramganj", "Khowai"],
      "North Tripura": ["Dharmanagar", "Kailashahar", "Kanchanpur", "Panisagar"],
      "Sepahijala": ["Bishramganj", "Jampuijala", "Sonamura", "Bishalgarh"],
      "South Tripura": ["Belonia", "Sabroom", "Amarpur", "Rajnagar"],
      "Unakoti": ["Kailashahar", "Kumarghat", "Pechwala", "Chhawman"],
      "West Tripura": ["Agartala", "Sadar", "Bishalgarh", "Jirania"]
    }
  },
  "Uttar Pradesh": {
    districts: {
      "Agra": ["Agra", "Firozabad", "Mathura", "Hathras", "Fatehpur Sikri"],
      "Aligarh": ["Aligarh", "Khair", "Atrauli", "Sikandra Rao", "Iglas"],
      "Allahabad": ["Allahabad", "Fatehpur", "Kaushambi", "Bara", "Shankargarh"],
      "Ambedkar Nagar": ["Akbarpur", "Ambedkar Nagar", "Tanda", "Bhulepur"],
      "Amethi": ["Gauriganj", "Amethi", "Sultanpur", "Musafirkhana"],
      "Amroha": ["Amroha", "Jyotiba Phule Nagar", "Dhanaura", "Naugawan"],
      "Auraiya": ["Auraiya", "Dibiyapur", "Ajitmal", "Sikandra"],
      "Ayodhya": ["Ayodhya", "Faizabad", "Milkipur", "Bikapur", "Sohwal"],
      "Azamgarh": ["Azamgarh", "Sagri", "Lalganj", "Mubarakpur", "Nizamabad"],
      "Baghpat": ["Baghpat", "Meerut", "Khekada", "Baraut"],
      "Bahraich": ["Bahraich", "Kaiserganj", "Mahasi", "Risia"],
      "Ballia": ["Ballia", "Bansdih", "Rasra", "Mundaha"],
      "Balrampur": ["Balrampur", "Tulsipur", "Gaisri", "Utraula"],
      "Banda": ["Banda", "Baberu", "Tindwari", "Kamasin"],
      "Barabanki": ["Barabanki", "Fatehpur", "Ramnagar", "Siddhaur"],
      "Bareilly": ["Bareilly", "Aonla", "Nawabganj", "Meerganj", "Faridpur"],
      "Basti": ["Basti", "Harraiya", "Kaptanganj", "Rudhauli"],
      "Bhadohi": ["Bhadohi", "Gyanpur", "Araziline", "Bhoodhar"],
      "Bijnor": ["Bijnor", "Dhampur", "Nagina", "Nehtaur", "Chandpur"],
      "Bulandshahr": ["Bulandshahr", "Khurja", "Sikandrabad", "Shikarpur"],
      "Chandauli": ["Chandauli", "Sakaldiha", "Chakia", "Nagar"],
      "Chitrakoot": ["Chitrakoot", "Manikpur", "Karaundi", "Maharoa"],
      "Deoria": ["Deoria", "Gorakhpur", "Bhatni", "Rudrapur", "Salempur"],
      "Etah": ["Etah", "Kasganj", "Patiyali", "Shikhohabad"],
      "Etawah": ["Etawah", "Bharthana", "Jaswantnagar", "Saifai"],
      "Faizabad": ["Faizabad", "Ayodhya", "Milkipur", "Bikapur"],
      "Farrukhabad": ["Farrukhabad", "Fatehgarh", "Kaimganj", "Amritpur"],
      "Fatehpur": ["Fatehpur", "Khaga", "Jahanabad", "Haswa"],
      "Firozabad": ["Firozabad", "Jasrana", "Shikohabad", "Tundla"],
      "Gautam Buddha Nagar": ["Noida", "Greater Noida", "Dadri", "Jewar"],
      "Ghaziabad": ["Ghaziabad", "Modinagar", "Muradnagar", "Sahibabad"],
      "Ghazipur": ["Ghazipur", "Zamania", "Saidpur", "Nizamabad"],
      "Gonda": ["Gonda", "Mankapur", "Tarabganj", "Wazirganj"],
      "Gorakhpur": ["Gorakhpur", "Khalilabad", "Bansgaon", "Campierganj"],
      "Hamirpur": ["Hamirpur", "Mahoba", "Charkhari", "Sarila"],
      "Hapur": ["Hapur", "Garhmukteshwar", "Duhai", "Pilkhuwa"],
      "Hardoi": ["Hardoi", "Shahabad", "Sandila", "Bilgram", "Sawaijpur"],
      "Hathras": ["Hathras", "Sikandra Rao", "Atrauli", "Iglas", "Sadabad"],
      "Jalaun": ["Orai", "Konch", "Madhogarh", "Kadaura", "Gursaray"],
      "Jaunpur": ["Jaunpur", "Shahganj", "Mariahu", "Machhlishahr"],
      "Jhansi": ["Jhansi", "Mauranipur", "Garautha", "Babina", "Baruwasagar"],
      "Kannauj": ["Kannauj", "Tirwaganj", "Kannauj", "Umarda"],
      "Kanpur Dehat": ["Kanpur Dehat", "Akbarpur", "Sikandra", "Bhognipur"],
      "Kanpur Nagar": ["Kanpur", "Kanpur Dehat", "Bithur", "Choubepur"],
      "Kasganj": ["Kasganj", "Patiyali", "Soron", "Ganjdundwara"],
      "Kaushambi": ["Kaushambi", "Manjhanpur", "Chail", "Sirathu"],
      "Kushinagar": ["Kushinagar", "Padrauna", "Hata", "Kaptanganj"],
      "Lakhimpur Kheri": ["Lakhimpur Kheri", "Mohammdi", "Nighasan", "Palia"],
      "Lalitpur": ["Lalitpur", "Talbehat", "Maharoli", "Bundela"],
      "Lucknow": ["Lucknow", "Mohanlalganj", "Bakshi Ka Talab", "Chinhat"],
      "Maharajganj": ["Maharajganj", "Siddharthnagar", "Pharenda", "Nichlaul"],
      "Mahoba": ["Mahoba", "Charkhari", "Kulpahar", "Baberu"],
      "Mainpuri": ["Mainpuri", "Bhogaon", "Kuraoli", "Karhal"],
      "Mathura": ["Mathura", "Brindaban", "Chhata", "Mant", "Goverdhan"],
      "Mau": ["Mau", "Ghosi", "Madhuban", "Rasulpur"],
      "Meerut": ["Meerut", "Mawana", " Sardhana", "Khekada"],
      "Mirzapur": ["Mirzapur", "Vindhyachal", "Chunar", "Ahraura"],
      "Moradabad": ["Moradabad", "Sambhal", "Bilari", "Thakurdwara"],
      "Muzaffarnagar": ["Muzaffarnagar", "Kairana", "Shamli", "Jansath"],
      "Pilibhit": ["Pilibhit", "Bisalpur", "Puranpur", " Barkhera"],
      "Pratapgarh": ["Pratapgarh", "Kunda", "Lambhua", "Sandwa Chandrik"],
      "Prayagraj": ["Prayagraj", "Handia", "Phulpur", "Soraon"],
      "Raebareli": ["Raebareli", "Dalmau", "Lalganj", "Maharajganj"],
      "Rampur": ["Rampur", "Shahabad", "Bilaspur", "Saidnagar"],
      "Saharanpur": ["Saharanpur", "Deoband", "Nakur", "Rampur"],
      "Sambhal": ["Sambhal", "Chandausi", "Gunnaur", "Bisauli"],
      "Sant Kabir Nagar": ["Sant Kabir Nagar", "Khalilabad", "Mehnagar", "Dhanghata"],
      "Shahjahanpur": ["Shahjahanpur", "Powayan", "Tilhar", "Jalalabad"],
      "Shamli": ["Shamli", "Kairana", "Muzaffarnagar", "Obra"],
      "Siddharthnagar": ["Siddharthnagar", "Bansi", "Domariyaganj", "Itwa"],
      "Sitapur": ["Sitapur", "Biswan", "Laharpur", "Mahmudabad"],
      "Sonbhadra": ["Sonbhadra", "Robertsganj", "Ghorawal", "Madhupur"],
      "Sultanpur": ["Sultanpur", "Kadipur", "Amethi", "Lambhua"],
      "Unnao": ["Unnao", "Safipur", "Mohan", "Purwa"],
      "Varanasi": ["Varanasi", "Ramnagar", "Chandauli", "Ghazipur"]
    }
  },
  "Uttarakhand": {
    districts: {
      "Almora": ["Almora", "Ranikhet", "Bageshwar", "Dwarahat", "Someshwar"],
      "Bageshwar": ["Bageshwar", "Kapkote", "Garjyani", "Kanda"],
      "Chamoli": ["Chamoli", "Gopeshwar", "Joshimath", "Badrinath", "Chopta"],
      "Champawat": ["Champawat", "Tanakpur", "Lohaghat", "Pati"],
      "Dehradun": ["Dehradun", "Mussoorie", "Rishikesh", "Haridwar", "Tehri"],
      "Haridwar": ["Haridwar", "Roorkee", "Laksar", "Khanpur"],
      "Nainital": ["Nainital", "Haldwani", "Ramnagar", "Mukteshwar", "Naukuchiatal"],
      "Pauri Garhwal": ["Pauri", "Kotdwar", "Lansdowne", "Satpuli"],
      "Pithoragarh": ["Pithoragarh", "Dharchula", "Munsiyari", "Didihat"],
      "Rudraprayag": ["Rudraprayag", "Ukhimath", "Jakholi", "Chamoli"],
      "Tehri Garhwal": ["Tehri", "New Tehri", "Ghanseli", "Dhanolti"],
      "Udham Singh Nagar": ["Rudrapur", "Kashipur", "Haldwani", "Ramnagar"],
      "Uttarkashi": ["Uttarkashi", "Gangotri", "Yamunotri", "Barkot"]
    }
  },
  "West Bengal": {
    districts: {
      "Alipurduar": ["Alipurduar", "Jalpaiguri", "Madarihat", "Birpara"],
      "Bankura": ["Bankura", "Bishnupur", "Khatra", "Raipur", "Taldangra"],
      "Birbhum": ["Suri", "Bolpur", "Rampur Hat", "Naihati", "Dubrajpur"],
      "Cooch Behar": ["Cooch Behar", "Dinhata", "Tufanganj", "Mathabhanga", "Mekhliganj"],
      "Dakshin Dinajpur": ["Balurghat", "Gangarampur", "Buniadpur", "Kushmandi"],
      "Darjeeling": ["Darjeeling", "Siliguri", "Kurseong", "Kalimpong", "Mirik"],
      "Hooghly": ["Chinsura", "Serampore", "Bandel", "Dankuni", "Tarakeswar"],
      "Howrah": ["Howrah", "Uluberia", "Bally", "Santragachi", "Shibpur"],
      "Jalpaiguri": ["Jalpaiguri", "Malbazar", "Dhupguri", "Mainaguri"],
      "Jhargram": ["Jhargram", "Ghatal", "Belpahari", "Binpur"],
      "Kolkata": ["Kolkata", "Howrah", "Hooghly", "North 24 Parganas", "South 24 Parganas"],
      "Malda": ["Malda", "English Bazar", "Old Malda", "Gazole", "Chanchal"],
      "Murshidabad": ["Berhampore", "Murshidabad", "Kandi", "Jangipur", "Dhulian"],
      "Nadia": ["Krishnanagar", "Shikarpur", "Kalyani", "Nabadwip", "Chakdaha"],
      "North 24 Parganas": ["Barrackpore", "Bhashan Char", "Deganga", "Habra", "Ashoknagar"],
      "Paschim Bardhaman": ["Asansol", "Durgapur", "Raniganj", "Jamuria", "Kulti"],
      "Paschim Medinipur": ["Medinipur", "Kharagpur", "Jhargram", "Garbeta", "Chandrakona"],
      "Purba Bardhaman": ["Bardhaman", "Kalna", "Memari", "Guskara", "Purbasthali"],
      "Purba Medinipur": ["Tamluk", "Haldia", "Egra", "Contai", "Panskura"],
      "Purulia": ["Purulia", "Raghunathpur", "Jhalida", "Balarampur", "Manbazar"],
      "South 24 Parganas": ["Alipore", "Baruipur", "Canning", "Diamond Harbour", "Gosaba"],
      "Uttar Dinajpur": ["Raiganj", "Islampur", "Kaliaganj", "Chakulia", "Hemtabad"]
    }
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: authUser, logout } = useContext(AuthContext);

  const openProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfile = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    closeProfile();
    navigate("/");
  };

  const [locationOpen, setLocationOpen] = useState(false);
  const user = authUser;

  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('fixoraLocation');
    return saved ? JSON.parse(saved) : {
      state: "Karnataka",
      district: "Bengaluru Urban",
      city: "Bengaluru",
      pincode: "560001"
    };
  });

  const [search, setSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchCategories = [
    { id: "home-cleaning", label: "Home Cleaning", keywords: ["cleaning", "home clean", "house cleaning"] },
    { id: "ac-repair", label: "AC Repair", keywords: ["ac", "air conditioner", "ac service"] },
    { id: "appliance-repair", label: "Appliance Repair", keywords: ["appliance", "washing machine", "fridge", "refrigerator"] },
    { id: "electrical", label: "Electrical", keywords: ["electrician", "electrical", "wiring"] },
    { id: "salon-spa", label: "Salon & Spa", keywords: ["salon", "spa", "beauty", "massage"] },
    { id: "painting", label: "Painting", keywords: ["painting", "paint", "wall"] },
    { id: "plumbing", label: "Plumbing", keywords: ["plumbing", "plumber", "water", "pipe"] },
    { id: "pest-control", label: "Pest Control", keywords: ["pest", "pest control", "cockroach"] },
    { id: "carpenter", label: "Carpenter", keywords: ["carpenter", "carpentry", "furniture"] },
    { id: "gardening", label: "Gardening", keywords: ["gardening", "garden", "landscape"] },
  ];

  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await publicServiceAPI.searchServices(query);
      const services = response.data || [];
      
      const suggestions = [];
      
      searchCategories.forEach(cat => {
        const match = cat.keywords.some(k => k.toLowerCase().includes(query.toLowerCase())) || 
                     cat.label.toLowerCase().includes(query.toLowerCase());
        if (match) {
          suggestions.push({ type: 'category', ...cat });
        }
      });
      
      services.slice(0, 5).forEach(service => {
        suggestions.push({ type: 'service', id: service._id, name: service.name, category: service.category });
      });
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      const matchedCategories = searchCategories.filter(cat => 
        cat.label.toLowerCase().includes(query.toLowerCase()) ||
        cat.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchSuggestions(matchedCategories.map(c => ({ type: 'category', ...c })));
      setShowSuggestions(true);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (search.trim()) {
      setShowSuggestions(false);
      navigate(`/services?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setShowSuggestions(false);
    setSearch("");
    if (suggestion.type === 'category') {
      navigate(`/services?category=${suggestion.id}`);
    } else {
      navigate(`/services?q=${encodeURIComponent(suggestion.name)}`);
    }
  };

  const [selectedState, setSelectedState] = useState(location.state || "Karnataka");
  const [selectedDistrict, setSelectedDistrict] = useState(location.district || "");

  const statesList = Object.keys(indianLocations);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "transparent",
        backdropFilter: "blur(0px)",
        WebkitBackdropFilter: "blur(0px)",
        boxShadow: "none",
        color: "#111",
        zIndex: 1300,
        backgroundImage: "none"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
          {/* LEFT SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* LOGO */}
            <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Box
                component="img"
                src={logo}
                alt="Fixora"
                sx={{ 
                  height: 42, 
                  cursor: "pointer",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                }}
              />
            </Box>

            {/* LOCATION SELECTOR */}
            <Box
              onClick={() => setLocationOpen(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                px: 2,
                py: 1,
                borderRadius: "12px",
                cursor: "pointer",
                border: "1px solid rgba(79, 70, 229, 0.2)",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                "&:hover": {
                  borderColor: "#4f46e5",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)"
                }
              }}
            >
              <MyLocationIcon sx={{ fontSize: 18, color: "#4f46e5" }} />
              <Box>
                <Typography sx={{ fontSize: "11px", color: "#666", lineHeight: 1.2 }}>
                  Deliver to
                </Typography>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", lineHeight: 1.2 }}>
                  {location.city || "Select"} {location.pincode}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* SEARCH BAR - HIDDEN ON MOBILE */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              px: 2.5,
              py: 1,
              borderRadius: "14px",
              width: "100%",
              maxWidth: 480,
              border: "1px solid rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: 'relative',
              "&:focus-within": {
                borderColor: "#4f46e5",
                boxShadow: "0 4px 20px rgba(79, 70, 229, 0.15)"
              }
            }}
            >
              <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
              <InputBase
                placeholder="Search for services..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => search.length >= 2 && setShowSuggestions(true)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                sx={{ flex: 1, ml: 1.5, fontSize: "14px" }}
              />
              {searchLoading && <CircularProgress size={16} sx={{ mr: 1 }} />}
            </Box>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <Box sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                mt: 1,
                maxHeight: 400,
                overflow: 'auto',
                zIndex: 1300,
                border: '1px solid #eee'
              }}>
                {searchSuggestions.map((suggestion, idx) => (
                  <Box
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.2s',
                      '&:hover': { background: '#f8fafc' }
                    }}
                  >
                    <Box sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      background: suggestion.type === 'category' ? '#e0e7ff' : '#f0fdf4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {suggestion.type === 'category' ? (
                        <SearchIcon sx={{ fontSize: 18, color: '#4f46e5' }} />
                      ) : (
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>S</Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 500, fontSize: 14, color: '#111' }}>
                        {suggestion.type === 'category' ? suggestion.label : suggestion.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#666' }}>
                        {suggestion.type === 'category' ? `${suggestion.keywords?.slice(0, 2).join(', ')}...` : suggestion.category}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Box 
                  onClick={handleSearchSubmit}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    borderTop: '1px solid #eee'
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: '#4f46e5', fontWeight: 500 }}>
                    Search for "{search}" →
                  </Typography>
                </Box>
              </Box>
            )}

          {/* RIGHT SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5 }}>
              <Button
                component={Link}
                to="/services"
                sx={{
                  color: "#1a1a2e",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: 2,
                  py: 1,
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  "&:hover": { bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
                }}
              >
                Services
              </Button>
              <Button
                component={Link}
                to="/provider"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "14px",
                  px: 3,
                  py: 1,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                    boxShadow: "0 6px 16px rgba(79, 70, 229, 0.4)"
                  }
                }}
              >
                Become Provider
              </Button>
            </Box>

            {user ? (
              <Box>
                <IconButton onClick={openProfile} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      fontSize: "14px",
                      fontWeight: 700,
                      border: "2px solid #fff",
                      boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)"
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeProfile}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: "16px",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                      border: "1px solid #f0f0f0",
                      minWidth: 200,
                      overflow: "visible"
                    }
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                    <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Box sx={{ py: 1 }}>
                    <MenuItem onClick={() => { closeProfile(); navigate("/profile"); }} sx={{ mx: 1, borderRadius: "8px" }}>
                      My Account
                    </MenuItem>
                    <MenuItem onClick={() => { closeProfile(); navigate("/bookings"); }} sx={{ mx: 1, borderRadius: "8px" }}>
                      My Bookings
                    </MenuItem>
                    <MenuItem onClick={() => { closeProfile(); navigate("/wishlist"); }} sx={{ mx: 1, borderRadius: "8px" }}>
                      My Wishlist
                    </MenuItem>
                    <MenuItem onClick={() => { closeProfile(); navigate("/edit-profile"); }} sx={{ mx: 1, borderRadius: "8px" }}>
                      Edit Profile
                    </MenuItem>
                    <MenuItem onClick={() => { closeProfile(); navigate("/change-password"); }} sx={{ mx: 1, borderRadius: "8px" }}>
                      Change Password
                    </MenuItem>
                    <Box sx={{ px: 2, pt: 1, mt: 1, borderTop: "1px solid #f0f0f0" }}>
                      <MenuItem onClick={handleLogout} sx={{ 
                        mx: -1, 
                        borderRadius: "8px", 
                        color: "#dc2626",
                        "&:hover": { bgcolor: "#fef2f2" }
                      }}>
                        Logout
                      </MenuItem>
                    </Box>
                  </Box>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#444",
                    fontWeight: 500,
                    fontSize: "14px",
                    px: 2,
                    "&:hover": { bgcolor: "#f5f5ff" }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "14px",
                    px: 3,
                    borderRadius: "10px",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                      boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)"
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}

            <IconButton
              component={Link}
              to="/cart"
              sx={{
                color: "#1a1a2e",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                "&:hover": { bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
              }}
            >
              <ShoppingCartIcon />
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ 
                display: { xs: "flex", md: "none" }, 
                color: "#1a1a2e",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                "&:hover": { bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Search Bar */}
        {mobileMenuOpen && (
          <Box sx={{ pb: 2, display: { xs: "block", md: "none" } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                background: "#f8f9fa",
                px: 2,
                py: 1,
                borderRadius: "12px"
              }}
            >
              <SearchIcon sx={{ color: "#999" }} />
              <InputBase
                placeholder="Search for services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flex: 1, ml: 1.5, fontSize: "14px" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto", pb: 1 }}>
              <Button size="small" component={Link} to="/services" sx={{ whiteSpace: "nowrap" }}>Services</Button>
              <Button size="small" component={Link} to="/provider" sx={{ whiteSpace: "nowrap", color: "#4f46e5" }}>Become Provider</Button>
            </Box>
          </Box>
        )}
      </Container>

      {/* LOCATION POPUP */}
      <Dialog
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
          py: 2.5,
          px: 3
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #f0f0ff 0%, #e8e4ff 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <MyLocationIcon sx={{ color: "#4f46e5", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                Select Your Location
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Choose your state, district, and city
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setLocationOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* State Selection */}
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                State *
              </Typography>
              <Select
                value={selectedState}
                onChange={(e) => {
                  const state = e.target.value;
                  setSelectedState(state);
                  const districts = Object.keys(indianLocations[state]?.districts || {});
                  setSelectedDistrict(districts[0] || "");
                }}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4f46e5"
                  }
                }}
              >
                {statesList.map((state) => (
                  <MenuItem key={state} value={state} sx={{ borderRadius: "8px", mx: 1, my: 0.5 }}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* District Selection */}
            <Box>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                District *
              </Typography>
              <Select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                fullWidth
                sx={{
                  borderRadius: "12px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0"
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4f46e5"
                  }
                }}
              >
                {Object.keys(indianLocations[selectedState]?.districts || {}).map((district) => (
                  <MenuItem key={district} value={district} sx={{ borderRadius: "8px", mx: 1, my: 0.5 }}>
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* City & Pincode */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  City/Village
                </Typography>
                <Select
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  fullWidth
                  size="small"
                  sx={{
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#e0e0e0"
                    }
                  }}
                >
                  {(indianLocations[selectedState]?.districts[selectedDistrict] || []).map((city) => (
                    <MenuItem key={city} value={city} sx={{ borderRadius: "8px", mx: 1, my: 0.5 }}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Pincode
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={location.pincode}
                  onChange={(e) => setLocation({ ...location, pincode: e.target.value })}
                  placeholder="Enter pincode"
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px"
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Selected Location Summary */}
            <Box sx={{
              p: 2,
              bgcolor: "#f8f9ff",
              borderRadius: "12px",
              border: "1px solid #e8e4ff"
            }}>
              <Typography variant="body2" color="text.secondary">
                Selected location: <strong>{selectedDistrict}, {selectedState}</strong>
              </Typography>
              {location.city && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  City: <strong>{location.city}</strong>
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setLocationOpen(false)}
            sx={{
              color: "#666",
              "&:hover": { bgcolor: "#f5f5f5" }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const newLocation = {
                state: selectedState,
                district: selectedDistrict,
                city: location.city || selectedDistrict,
                pincode: location.pincode || ""
              };
              localStorage.setItem('fixoraLocation', JSON.stringify(newLocation));
              setLocation(newLocation);
              setLocationOpen(false);
            }}
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              borderRadius: "12px",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)"
              }
            }}
          >
            Save Location
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
