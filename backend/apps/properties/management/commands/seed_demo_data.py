from django.core.management.base import BaseCommand

from apps.properties.models import Amenity, Category, Property, PropertyImage
from apps.team.models import TeamMember


def IMG(photo_id):
    return f"https://images.unsplash.com/photo-{photo_id}?q=80&w=1400&auto=format&fit=crop"


# Curated, thematically-matched Unsplash photo IDs. This is a dev-mode convenience —
# these are real stock photos (not photos of these specific fictional properties), chosen
# to look right for each property type (villa, apartment, land, office, condo, warehouse,
# event hall) and swappable any time by editing the id string below.
PHOTOS = {
    "villa_dusk_pool": "1613977257363-707ba9348227",
    "villa_night": "1512917774080-9991f1c4c750",
    "modern_house": "1600585154340-be6161a56a0c",
    "modern_house_2": "1600607687939-ce8a6c25118c",
    "villa_pool": "1600566753086-00f18fb6b3ea",
    "villa_exterior": "1600047509807-ba8f99d2cdde",
    "office_building": "1497366216548-37526070297c",
    "office_building_2": "1554469384-e58fac16e23a",
    "office_interior": "1497215842964-222b430dc094",
    "apartment_interior": "1502672260266-1c1ef2d93688",
    "apartment_interior_2": "1560448204-e02f11c3d0e2",
    "living_room": "1522708323590-d24dbb6b0267",
    "apartment_interior_3": "1493809842364-78817add7ffb",
    "family_house": "1570129477492-45c003edd2be",
    "family_house_2": "1583608205776-bfd35f0d9f83",
    "townhouse": "1600566752355-35792bedcfea",
    "condo_building": "1545324418-cc1a3fa10c00",
    "condo_building_2": "1554995207-c18c203602cb",
    "warehouse": "1512453979798-5ea266f8880c",
    "warehouse_interior": "1553413077-190dd305871c",
    "warehouse_dock": "1580674285054-bed31e145f59",
    "warehouse_racks": "1600880292203-757bb62b4baf",
    "event_hall": "1519167758481-83f550bb49b3",
    "event_venue": "1519741497674-611481863552",
    "event_hall_alt": "1511578314322-379afb476865",
    "land_aerial": "1500382017468-9049fed747ef",
    "land_aerial_2": "1464082354059-27db6ce50048",
    "land_coastal": "1500534623283-312aade485b2",
    "land_aerial_3": "1502920917128-1aa500764cbd",
}

TEAM_PHOTOS = {
    "man_1": "1560250097-0b93528c311a",
    "woman_1": "1573496359142-b8d87734a5a2",
    "man_2": "1519345182560-3f2917c472ef",
    "woman_2": "1580489944761-15a19d654956",
}

# Per-category photo pools to draw galleries from — keeps each property's 3-4 images
# thematically consistent (residential exteriors don't mix with warehouse interiors).
POOLS = {
    "Luxury Houses": ["villa_dusk_pool", "villa_night", "modern_house", "modern_house_2",
                       "villa_pool", "villa_exterior", "living_room"],
    "Villas": ["villa_dusk_pool", "villa_pool", "villa_exterior", "villa_night", "living_room"],
    "Apartments": ["apartment_interior", "apartment_interior_2", "apartment_interior_3", "living_room"],
    "Prime Lands": ["land_aerial", "land_aerial_2", "land_coastal", "land_aerial_3"],
    "Family Homes": ["family_house", "family_house_2", "townhouse", "living_room"],
    "Office Space": ["office_building", "office_building_2", "office_interior", "living_room"],
    "Condos": ["condo_building", "condo_building_2", "apartment_interior_2", "living_room"],
    "Warehouses": ["warehouse", "warehouse_interior", "warehouse_dock", "warehouse_racks"],
    "Event Centers": ["event_hall", "event_venue", "event_hall_alt", "office_building_2"],
}


def gallery_for(category_name, offset, count=4):
    """Rotate through that category's pool starting at `offset` so consecutive
    properties in the same category don't all get identical image order."""
    pool = POOLS[category_name]
    n = len(pool)
    picks = [pool[(offset + i) % n] for i in range(min(count, n))]
    return [PHOTOS[p] for p in picks]


class Command(BaseCommand):
    help = "Seeds demo data matching the Heritage Estates Figma content, with real dev-mode photos."

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")
        categories = {
            "Luxury Houses": dict(icon="villa", badge_label="PREMIUM SELECTION", is_specific_need=False,
                                   description="420+ Available Properties", hero_image_url=IMG(PHOTOS["villa_dusk_pool"])),
            "Prime Lands": dict(icon="land", is_specific_need=False,
                                 description="150+ Plots", hero_image_url=IMG(PHOTOS["land_aerial"])),
            "Family Homes": dict(icon="family-home", is_specific_need=False,
                                  description="310+ Listings", hero_image_url=IMG(PHOTOS["family_house"])),
            "Apartments": dict(icon="apartment", is_specific_need=True,
                                description="Stylish and convenient urban living spaces designed for modern city dwellers seeking proximity to hubs.",
                                hero_image_url=IMG(PHOTOS["apartment_interior"])),
            "Office Space": dict(icon="office", is_specific_need=True,
                                  description="Premium workspaces and commercial real estate situated in prime business districts to elevate your brand.",
                                  hero_image_url=IMG(PHOTOS["office_building"])),
            "Villas": dict(icon="villa", is_specific_need=True,
                            description="Exclusive standalone properties offering maximum privacy, extensive grounds, and unparalleled luxury amenities.",
                            hero_image_url=IMG(PHOTOS["villa_exterior"])),
            "Condos": dict(icon="condo", is_specific_need=True,
                            description="High-end condominium living featuring shared premium facilities, exceptional security, and vibrant community.",
                            hero_image_url=IMG(PHOTOS["condo_building"])),
            "Warehouses": dict(icon="warehouse", is_specific_need=False,
                                description="Industrial and logistics spaces built for scale, access, and secure storage.",
                                hero_image_url=IMG(PHOTOS["warehouse"])),
            "Event Centers": dict(icon="event", is_specific_need=False,
                                   description="Versatile venues for conferences, weddings, and large-scale gatherings.",
                                   hero_image_url=IMG(PHOTOS["event_hall"])),
        }
        cat_objs = {}
        for i, (name, fields) in enumerate(categories.items()):
            obj, _ = Category.objects.update_or_create(name=name, defaults={**fields, "display_order": i})
            cat_objs[name] = obj

        self.stdout.write("Seeding amenities...")
        amenity_names = [
            "Smart Home Integration", "Infinity Swimming Pool", "Private Cinema Room",
            "Fully Equipped Gym", "Wine Cellar", "24/7 Concierge Security",
            "Servant Quarters (2 Rooms)", "High-Speed Fiber Internet",
        ]
        amenities = [Amenity.objects.get_or_create(name=n)[0] for n in amenity_names]

        self.stdout.write("Seeding team members...")
        team = [
            dict(name="Olumide Adeyemi", title="Senior Consultant", specialty_tag="COMMERCIAL",
                 display_order=0, photo_url=IMG(TEAM_PHOTOS["man_1"])),
            dict(name="Aisha Bello", title="Principal Partner", specialty_tag="RESIDENTIAL",
                 display_order=1, photo_url=IMG(TEAM_PHOTOS["woman_1"])),
            dict(name="Chike Eze", title="Investment Advisor", specialty_tag="PORTFOLIO MGT",
                 display_order=2, photo_url=IMG(TEAM_PHOTOS["man_2"])),
            dict(name="Nneka Okafor", title="Legal Counsel", specialty_tag="ACQUISITIONS",
                 display_order=3, photo_url=IMG(TEAM_PHOTOS["woman_2"])),
        ]
        for t in team:
            TeamMember.objects.update_or_create(name=t["name"], defaults=t)

        self.stdout.write("Seeding properties across all categories...")
        properties = [
            # ---- Luxury Houses ----
            dict(title="The Ikoyi Oasis", category="Luxury Houses", purchase_type="sale",
                 property_type="detached", price=450000000, area="Ikoyi", city="Lagos",
                 bedrooms=5, bathrooms=6, size_sqm=850, is_top_choice=False, is_featured=True,
                 summary="Spacious 5-bedroom detached home in a secure Ikoyi enclave.", gallery_offset=0),
            dict(title="The Apex Residence", category="Luxury Houses", purchase_type="sale",
                 property_type="detached", price=1200000000, area="Banana Island", city="Lagos",
                 bedrooms=5, bathrooms=6, size_sqm=850, is_top_choice=False, is_featured=False,
                 summary="A statement residence on Banana Island.", gallery_offset=1),
            dict(title="The Heritage Estate", category="Luxury Houses", purchase_type="sale",
                 property_type="detached", price=2500000000, area="Maitama", city="Abuja",
                 bedrooms=7, bathrooms=8, size_sqm=2100, is_top_choice=False, is_featured=False,
                 summary="A grand colonnaded estate set on manicured grounds.", gallery_offset=2),
            dict(title="Premium 4-Bed Duplex", category="Luxury Houses", purchase_type="sale",
                 property_type="semi_detached", price=320000000, area="Maitama", city="Abuja",
                 bedrooms=4, bathrooms=5, size_sqm=520, is_top_choice=False, is_featured=False,
                 summary="A duplex finished to a diplomatic standard.", gallery_offset=3),
            dict(title="Diplomatic Estate Home", category="Luxury Houses", purchase_type="sale",
                 property_type="detached", price=1200000000, area="Asokoro", city="Abuja",
                 bedrooms=6, bathrooms=7, size_sqm=1100, is_top_choice=False, is_featured=False,
                 summary="Perimeter security and mature landscaped grounds.", gallery_offset=4),

            # ---- Villas ----
            dict(title="The Ikoyi Glasshouse", category="Villas", purchase_type="sale",
                 property_type="villa", price=850000000, area="Ikoyi", city="Lagos",
                 bedrooms=6, bathrooms=7.5, size_sqm=1250, is_top_choice=True, is_featured=True,
                 summary="An architectural masterpiece with panoramic glass and a private pool deck.",
                 description=(
                     "An architectural masterpiece situated in the most prestigious enclave of Ikoyi. "
                     "The Glasshouse represents the pinnacle of contemporary Nigerian luxury living, offering "
                     "unparalleled privacy, security, and design excellence.\n\n"
                     "Spanning over 1,250 square meters of meticulously curated living space, this smart-home "
                     "enabled villa features expansive floor-to-ceiling panoramic windows that flood the interiors "
                     "with natural light, blurring the boundaries between the lush outdoor landscaping and the "
                     "sophisticated indoor environment.\n\n"
                     "The ground floor hosts a breathtaking double-volume living area, a state-of-the-art chef's "
                     "kitchen outfitted with premium European appliances, and a seamless flow out to the infinity "
                     "pool and entertainment deck. Upstairs, the master suite is a sanctuary of comfort, complete "
                     "with a private terrace, his-and-hers walk-in closets, and a spa-like en-suite bathroom."
                 ),
                 full_address="14 Bourdillon Road, Ikoyi, Lagos", gallery_offset=0),
            dict(title="Modern Smart Villa", category="Villas", purchase_type="sale",
                 property_type="villa", price=850000000, area="Victoria Island", city="Lagos",
                 bedrooms=5, bathrooms=6, size_sqm=980, is_top_choice=True, is_featured=False,
                 summary="Full smart-home automation with an oceanfront pool deck.", gallery_offset=1),
            dict(title="Banana Island Villa", category="Villas", purchase_type="sale",
                 property_type="villa", price=1450000000, area="Banana Island", city="Lagos",
                 bedrooms=6, bathrooms=7, size_sqm=1300, is_top_choice=False, is_featured=False,
                 summary="A waterfront villa with a private jetty and boat dock.", gallery_offset=2),

            # ---- Apartments ----
            dict(title="Victoria Island Penthouse", category="Apartments", purchase_type="rent",
                 property_type="apartment", price=250000, rent_period="night", area="Victoria Island",
                 city="Lagos", bedrooms=3, bathrooms=4.5, size_sqm=600, is_top_choice=True, is_featured=True,
                 summary="Panoramic lagoon views with top-tier smart-home finishing.", gallery_offset=0),
            dict(title="Skyline Penthouse", category="Apartments", purchase_type="rent",
                 property_type="apartment", price=45000000, rent_period="year", area="Victoria Island",
                 city="Lagos", bedrooms=4, bathrooms=4.5, size_sqm=600, is_top_choice=False, is_featured=False,
                 summary="City-skyline views from every principal room.", gallery_offset=1),
            dict(title="Ocean-view Penthouse", category="Apartments", purchase_type="sale",
                 property_type="apartment", price=950000000, area="Eko Atlantic", city="Lagos",
                 bedrooms=4, bathrooms=5, size_sqm=680, is_top_choice=True, is_featured=False,
                 summary="Floor-to-ceiling ocean views on Eko Atlantic's shoreline.", gallery_offset=2),
            dict(title="The Azure Penthouse", category="Apartments", purchase_type="rent",
                 property_type="apartment", price=250000, rent_period="night", area="Banana Island",
                 city="Ikoyi", bedrooms=3, bathrooms=3.5, size_sqm=340, is_top_choice=True, is_featured=False,
                 summary="Exquisite 3-bedroom luxury apartment offering panoramic lagoon views and top-tier finishing.",
                 gallery_offset=3),

            # ---- Prime Lands ----
            dict(title="Maitama Prime Plot", category="Prime Lands", purchase_type="sale",
                 property_type="land", price=320000000, area="Maitama", city="Abuja",
                 size_sqm=2100, is_top_choice=False, is_featured=True,
                 summary="A serviced plot in one of Abuja's most prestigious districts.", gallery_offset=0),
            dict(title="Epe Waterfront Plot", category="Prime Lands", purchase_type="sale",
                 property_type="land", price=85000000, area="Epe", city="Lagos",
                 size_sqm=3000, is_top_choice=False, is_featured=False,
                 summary="A waterfront plot with deep-water access, zoned for private development.", gallery_offset=1),
            dict(title="Chevron Drive Land", category="Prime Lands", purchase_type="sale",
                 property_type="land", price=180000000, area="Lekki", city="Lagos",
                 size_sqm=1800, is_top_choice=False, is_featured=False,
                 summary="A dry, serviced plot minutes from the Lekki-Epe expressway.", gallery_offset=2),

            # ---- Family Homes ----
            dict(title="Contemporary Townhouse", category="Family Homes", purchase_type="sale",
                 property_type="semi_detached", price=280000000, area="Lekki Phase 1", city="Lagos",
                 bedrooms=4, bathrooms=4.5, size_sqm=380, is_top_choice=False, is_featured=False,
                 summary="A family-friendly townhouse inside a gated community.", gallery_offset=0),
            dict(title="Oakwood Terraces", category="Family Homes", purchase_type="rent",
                 property_type="semi_detached", price=12000000, rent_period="year", area="Lekki Phase 1",
                 city="Lagos", bedrooms=4, bathrooms=4.5, size_sqm=420, is_top_choice=False, is_featured=False,
                 summary="Spacious 4-bedroom terrace duplex in a secure gated community with a communal park.",
                 gallery_offset=1),
            dict(title="GRA Family Bungalow", category="Family Homes", purchase_type="sale",
                 property_type="detached", price=95000000, area="GRA", city="Port Harcourt",
                 bedrooms=4, bathrooms=3, size_sqm=340, is_top_choice=False, is_featured=False,
                 summary="A single-storey family bungalow on a quiet tree-lined GRA street.", gallery_offset=2),

            # ---- Office Space ----
            dict(title="Victoria Island Office Suite", category="Office Space", purchase_type="lease",
                 property_type="office", price=25000000, rent_period="year", area="Victoria Island",
                 city="Lagos", size_sqm=450, is_top_choice=False, is_featured=False,
                 summary="A full-floor office suite in a Grade-A commercial tower.", gallery_offset=0),
            dict(title="Ikeja Business Hub", category="Office Space", purchase_type="lease",
                 property_type="office", price=15000000, rent_period="year", area="Ikeja GRA",
                 city="Lagos", size_sqm=320, is_top_choice=False, is_featured=False,
                 summary="Flexible open-plan office space near the Ikeja business district.", gallery_offset=1),

            # ---- Condos ----
            dict(title="Eko Atlantic Condo", category="Condos", purchase_type="sale",
                 property_type="condo", price=380000000, area="Eko Atlantic", city="Lagos",
                 bedrooms=3, bathrooms=3.5, size_sqm=290, is_top_choice=False, is_featured=False,
                 summary="A shoreline condo with resort-style shared amenities.", gallery_offset=0),
            dict(title="Lekki Gardens Condo", category="Condos", purchase_type="sale",
                 property_type="condo", price=145000000, area="Lekki", city="Lagos",
                 bedrooms=2, bathrooms=2.5, size_sqm=180, is_top_choice=False, is_featured=False,
                 summary="A landscaped condo development with a shared pool and gym.", gallery_offset=1),

            # ---- Warehouses ----
            dict(title="Apapa Logistics Warehouse", category="Warehouses", purchase_type="lease",
                 property_type="warehouse", price=40000000, rent_period="year", area="Apapa",
                 city="Lagos", size_sqm=4500, is_top_choice=False, is_featured=False,
                 summary="Port-adjacent warehousing with 24-hour container access.", gallery_offset=0),
            dict(title="Ogun Industrial Warehouse", category="Warehouses", purchase_type="sale",
                 property_type="warehouse", price=220000000, area="Sagamu", city="Ogun",
                 size_sqm=6000, is_top_choice=False, is_featured=False,
                 summary="A high-clearance industrial warehouse with loading-bay access.", gallery_offset=1),

            # ---- Event Centers ----
            dict(title="The Grand Pavilion", category="Event Centers", purchase_type="lease",
                 property_type="event_center", price=4500000, rent_period="day", area="Victoria Island",
                 city="Lagos", size_sqm=1500, is_top_choice=False, is_featured=False,
                 summary="Versatile 1,500 capacity event hall ideal for corporate conferences, weddings, and galas.",
                 gallery_offset=0),
        ]

        for p in properties:
            cat_name = p.pop("category")
            offset = p.pop("gallery_offset")
            photos = gallery_for(cat_name, offset, count=4)
            p["category"] = cat_objs[cat_name]
            obj, created = Property.objects.update_or_create(title=p["title"], defaults=p)
            if created or not obj.amenities.exists():
                obj.amenities.set(amenities[:6])

            obj.images.all().delete()
            for i, photo_id in enumerate(photos):
                PropertyImage.objects.create(
                    property=obj,
                    image_url=IMG(photo_id),
                    is_primary=(i == 0),
                    display_order=i,
                )

        self.stdout.write(self.style.SUCCESS(
            f"Seeded {len(categories)} categories, {len(properties)} properties (each with a "
            f"3-4 image gallery), and {len(team)} team members."
        ))