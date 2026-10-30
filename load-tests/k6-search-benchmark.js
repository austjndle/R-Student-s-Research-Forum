import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },  // 10 concurrent users
    { duration: "15s", target: 50 },  // 50 concurrent users
    { duration: "15s", target: 100 }, // 100 concurrent users
    { duration: "10s", target: 500 }, // 500 concurrent users spike
    { duration: "10s", target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<300"], // 95% of search requests under 300ms
    http_req_failed: ["rate<0.01"],   // Error rate under 1%
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

const QUERIES = [
  "change major",
  "đổi ngành",
  "tuition fees",
  "học bổng",
  "student connect",
  "census date",
  "library hours",
  "thư viện",
  "it support wifi",
  "counseling wellbeing"
];

export default function () {
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];

  // 1. Test Search API
  const searchRes = http.get(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}&limit=10`);
  check(searchRes, {
    "search status is 200": (r) => r.status === 200,
    "search returns results": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.results && body.results.length > 0;
      } catch (e) {
        return false;
      }
    },
  });

  // 2. Test Quota / Usage endpoint
  const usageRes = http.get(`${BASE_URL}/api/usage`);
  check(usageRes, {
    "usage status is 200": (r) => r.status === 200,
  });

  sleep(0.5);
}
