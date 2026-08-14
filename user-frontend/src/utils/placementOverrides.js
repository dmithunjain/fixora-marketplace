import { mapService } from "./serviceMapper";

const normalizeResponse = (res) => res?.data || res;

export const normalizePageId = (id) => String(id || "").trim();

export const buildPlacementService = (placement) => {
  const sourceService = placement?.service || placement?.serviceId;
  const mapped = mapService(sourceService);
  if (!mapped) return null;

  const pageId = normalizePageId(placement?.targetPageId);
  return {
    ...mapped,
    id: pageId || mapped.id,
    targetPageId: pageId,
    category: placement?.categoryId || mapped.category,
    categoryId: placement?.categoryId || mapped.categoryId || mapped.category,
  };
};

export const applyPlacementOverrides = (staticList, placements, appendNew = true) => {
  const base = Array.isArray(staticList) ? [...staticList] : [];
  const placementList = Array.isArray(placements) ? placements : [];

  const replacementMap = new Map();
  for (const placement of placementList) {
    const service = buildPlacementService(placement);
    if (!service) continue;
    const key = normalizePageId(placement?.targetPageId);
    if (!key) continue;
    replacementMap.set(key, service);
  }

  const overridden = base.map((service) => {
    const key = normalizePageId(service?.id);
    return replacementMap.get(key) || service;
  });

  if (!appendNew) {
    return overridden;
  }

  const existingKeys = new Set(overridden.map((s) => normalizePageId(s?.id)));
  for (const [pageId, service] of replacementMap.entries()) {
    if (!existingKeys.has(pageId)) {
      overridden.push(service);
      existingKeys.add(pageId);
    }
  }

  return overridden;
};

export const extractPlacements = (response) => {
  const payload = normalizeResponse(response);
  return Array.isArray(payload?.placements) ? payload.placements : [];
};
