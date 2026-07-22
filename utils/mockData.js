export const mockProperties = [
  {
    id: 1,
    title: "3 BHK Luxury Apartment in Hiranandani Gardens",
    description: "Located in the ultra-premium Hiranandani Gardens, Powai, this semi-furnished 3 BHK flat features imported marble flooring, modular kitchen with built-in hob and chimney, designer false ceiling, and automation-ready electrical panels. Enjoy beautiful high-rise views of the Powai lake and hills. The residential tower provides access to a fully equipped clubhouse, Olympic-sized swimming pool, state-of-the-art gymnasium, 24/7 multi-tier security, and 2 dedicated basement car parks.",
    price: 28500000,
    city: "Mumbai",
    address: "Oakwood Towers, Hiranandani Gardens, Powai",
    bedrooms: 3,
    bathrooms: 3,
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=85",
    property_type: "Apartment",
    area_sqft: 1650,
    status: "Available",
    owner_id: 999,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    title: "4 BHK Ultra Villa in Prestige Ozone",
    description: "Exclusive 4 BHK standalone villa in one of Bangalore's most sought-after gated communities, Prestige Ozone. Offers a private landscaped garden space, private home theater room, premium Italian marble bath fittings, solar power grid backup, and private terrace lounge. Fully integrated automation for lighting and climate control. Close to top international schools, healthcare facilities, and IT tech parks in Whitefield.",
    price: 45000000,
    city: "Bangalore",
    address: "Prestige Ozone, Whitefield",
    bedrooms: 4,
    bathrooms: 4,
    image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85",
    property_type: "Villa",
    area_sqft: 3800,
    status: "Available",
    owner_id: 998,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 3,
    title: "2 BHK Elegant Penthouse in Kalyani Nagar",
    description: "Modern 2 BHK penthouse with a huge private terrace deck offering Pune's iconic skyline views. Fully modular European kitchen, customized walk-in closets, remote-controlled smart curtains, and indirect warm ambient lighting. Building amenities include high-speed elevators, power backup, sky lounge access, and round-the-clock concierge services.",
    price: 16500000,
    city: "Pune",
    address: "Kalyani Nagar Skyline Heights",
    bedrooms: 2,
    bathrooms: 2,
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85",
    property_type: "Penthouse",
    area_sqft: 1100,
    status: "Available",
    owner_id: 997,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 4,
    title: "5 BHK Royal Palace Villa in DLF Phase 5",
    description: "Experience royal living in this grand 5 BHK modern palace villa. Featuring double-height ceilings, a private indoor swimming pool, a fully-fitted gym space, separate servant quarters, and custom-designed crystal chandeliers. Equipped with advanced VRV central air-conditioning and multi-zone secure card entry. Nestled inside a highly secure and landscaped DLF enclave.",
    price: 98000000,
    city: "Delhi",
    address: "Golf Course Road, DLF Phase 5",
    bedrooms: 5,
    bathrooms: 5,
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85",
    property_type: "Villa",
    area_sqft: 6500,
    status: "Available",
    owner_id: 996,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 5,
    title: "3 BHK Premium Condo in Jubilee Hills",
    description: "High-end 3 BHK condominium featuring structural floor-to-ceiling glass windows, wide sun deck balcony, separate dry and wet kitchens, and high-quality wooden deck flooring in master suites. Complete home automation controls, centralized security logs, and multi-car automated parking slots. Located in the luxurious heights of Jubilee Hills.",
    price: 32000000,
    city: "Hyderabad",
    address: "Jubilee Hills View Apartments",
    bedrooms: 3,
    bathrooms: 3,
    image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85",
    property_type: "Condo",
    area_sqft: 2200,
    status: "Available",
    owner_id: 995,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 6,
    title: "4 BHK Luxury Penthouse in Boat Club Road",
    description: "Unmatched ultra-luxury 4 BHK duplex penthouse overlooking Pune's finest tree-lined lanes. Comes with a private infinity-edge plunge pool, an outdoor bar counter, customized home theater room, and Italian marble cladding. A rare listing offering supreme privacy, direct keycard elevator entry, and round-the-clock concierge services.",
    price: 52000000,
    city: "Pune",
    address: "Boat Club Road Elite",
    bedrooms: 4,
    bathrooms: 4,
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
    property_type: "Penthouse",
    area_sqft: 4200,
    status: "Available",
    owner_id: 994,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export function getMockProperties() {
  return mockProperties;
}

export function getMockPropertyById(id) {
  const numericId = parseInt(id);
  return mockProperties.find((p) => p.id === numericId) || null;
}

export function getSimilarMockProperties(id) {
  const current = getMockPropertyById(id);
  if (!current) return [];
  return mockProperties.filter(
    (p) => p.id !== current.id && (p.city === current.city || p.property_type === current.property_type)
  ).slice(0, 3);
}
