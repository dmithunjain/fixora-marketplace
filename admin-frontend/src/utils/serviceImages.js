// Returns an Unsplash source URL for a given service type.
// Uses simple mapping to keywords; appends a sig to vary images per provider.
export function getServiceImage(serviceType = '', seed = '', size = '400x300') {
  const map = {
    electrician: 'electrician,repair,wires',
    plumber: 'plumber,pipe,repair',
    carpenter: 'carpenter,woodwork,tools',
    welder: 'welder,welding,sparks,metal',
    painter: 'painter,painting,wall',
    cleaner: 'cleaning,house,maid',
    'pest control': 'pest control,spraying,insect',
    'pestcontrol': 'pest control,spraying,insect',
    'home appliance repair': 'technician,repair,appliance',
    'locksmith': 'locksmith,keys,lock',
    'default': 'worker,trade,service'
  };

  const key = (serviceType || '').toString().trim().toLowerCase();
  const query = map[key] || map.default || key || 'worker,trade';
  // Unsplash source endpoint — if API key unavailable, this is free to use for demos
  const encoded = encodeURIComponent(query);
  const sig = seed ? `&sig=${encodeURIComponent(seed)}` : '';
  return `https://source.unsplash.com/${size}/?${encoded}${sig}`;
}

export default getServiceImage;
