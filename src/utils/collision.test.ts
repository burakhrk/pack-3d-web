import { describe, it, expect } from "vitest";
import {
  checkCollision,
  fitsInContainer,
  hasCollision,
  calculateUtilization,
  calculateVolume,
  Box,
} from "./collision";
import { Item, PackedItem } from "@/types/packing";

describe("Collision Detection", () => {
  describe("checkCollision", () => {
    it("should detect collision when boxes overlap", () => {
      const box1: Box = { x: 0, y: 0, z: 0, width: 5, height: 5, depth: 5 };
      const box2: Box = { x: 3, y: 3, z: 3, width: 5, height: 5, depth: 5 };
      expect(checkCollision(box1, box2)).toBe(true);
    });

    it("should not detect collision when boxes don't overlap", () => {
      const box1: Box = { x: 0, y: 0, z: 0, width: 5, height: 5, depth: 5 };
      const box2: Box = { x: 10, y: 10, z: 10, width: 5, height: 5, depth: 5 };
      expect(checkCollision(box1, box2)).toBe(false);
    });

    it("should detect collision when boxes touch", () => {
      const box1: Box = { x: 0, y: 0, z: 0, width: 5, height: 5, depth: 5 };
      const box2: Box = { x: 5, y: 0, z: 0, width: 5, height: 5, depth: 5 };
      // Touching boxes are considered as not colliding (edge case)
      expect(checkCollision(box1, box2)).toBe(false);
    });
  });

  describe("fitsInContainer", () => {
    const container = { width: 10, height: 10, depth: 10 };

    it("should return true when item fits in container", () => {
      const item: Item = {
        id: "1",
        name: "Test",
        width: 5,
        height: 5,
        depth: 5,
      };
      const position = { x: 0, y: 0, z: 0 };
      expect(fitsInContainer(item, position, container)).toBe(true);
    });

    it("should return false when item exceeds container width", () => {
      const item: Item = {
        id: "1",
        name: "Test",
        width: 5,
        height: 5,
        depth: 5,
      };
      const position = { x: 6, y: 0, z: 0 };
      expect(fitsInContainer(item, position, container)).toBe(false);
    });

    it("should return false when item has negative position", () => {
      const item: Item = {
        id: "1",
        name: "Test",
        width: 5,
        height: 5,
        depth: 5,
      };
      const position = { x: -1, y: 0, z: 0 };
      expect(fitsInContainer(item, position, container)).toBe(false);
    });

    it("should return true when item exactly fits at edge", () => {
      const item: Item = {
        id: "1",
        name: "Test",
        width: 5,
        height: 5,
        depth: 5,
      };
      const position = { x: 5, y: 5, z: 5 };
      expect(fitsInContainer(item, position, container)).toBe(true);
    });
  });

  describe("hasCollision", () => {
    it("should detect collision with packed items", () => {
      const item: Item = {
        id: "new",
        name: "New Item",
        width: 3,
        height: 3,
        depth: 3,
      };
      const position = { x: 2, y: 2, z: 2 };
      const packedItems: PackedItem[] = [
        {
          id: "1",
          name: "Existing",
          width: 5,
          height: 5,
          depth: 5,
          position: { x: 0, y: 0, z: 0 },
          color: "#FF0000",
        },
      ];

      expect(hasCollision(item, position, packedItems)).toBe(true);
    });

    it("should not detect collision when no overlap", () => {
      const item: Item = {
        id: "new",
        name: "New Item",
        width: 3,
        height: 3,
        depth: 3,
      };
      const position = { x: 10, y: 10, z: 10 };
      const packedItems: PackedItem[] = [
        {
          id: "1",
          name: "Existing",
          width: 5,
          height: 5,
          depth: 5,
          position: { x: 0, y: 0, z: 0 },
          color: "#FF0000",
        },
      ];

      expect(hasCollision(item, position, packedItems)).toBe(false);
    });
  });

  describe("calculateVolume", () => {
    it("should calculate volume correctly", () => {
      const dimensions = { width: 3, height: 4, depth: 5 };
      expect(calculateVolume(dimensions)).toBe(60);
    });

    it("should handle zero dimensions", () => {
      const dimensions = { width: 0, height: 4, depth: 5 };
      expect(calculateVolume(dimensions)).toBe(0);
    });
  });

  describe("calculateUtilization", () => {
    it("should calculate utilization percentage correctly", () => {
      const containerVolume = 1000;
      const usedVolume = 750;
      expect(calculateUtilization(containerVolume, usedVolume)).toBe(75);
    });

    it("should return 0 when container volume is 0", () => {
      expect(calculateUtilization(0, 100)).toBe(0);
    });

    it("should handle 100% utilization", () => {
      expect(calculateUtilization(100, 100)).toBe(100);
    });

    it("should handle 0% utilization", () => {
      expect(calculateUtilization(100, 0)).toBe(0);
    });
  });
});
