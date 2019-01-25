# downsampling experiments

All tests are run in the following conditions:

- dataset: rushmore
- desired number of data points: (dataset length / 10)
- ms values are averaged out of 10 requests

Notes

- more than 1000 ms in the tests below are due to an s3 file download.

## Without downsampling

avg response time: 1600ms
response size ~2.5MB

## With downsampling

An index is built to store association between point index and date string, then downsampling is run on {x: index, y: temperature}. Result is mapped again to {x: dateString, y: temperature} thanks to the date index.

LTD: 1603 ms
LTTB: 1304 ms
LTOB: 1428 ms

response size ~250 KB
