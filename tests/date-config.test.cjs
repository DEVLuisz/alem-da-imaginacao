const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../JS/date.js'), 'utf8');
const configSource = source.slice(0, source.indexOf('(function () {'));
const config = vm.runInNewContext(configSource + '\nDATE_CONFIG;');

test('public date configuration contains only example cities', () => {
  assert.deepEqual(Object.keys(config.LUGARES), [
    'Cidade de exemplo - UF',
    'Outra cidade de exemplo - UF',
  ]);
});

test('public date configuration contains only example places', () => {
  const places = Object.values(config.LUGARES).flat();
  assert.deepEqual(Array.from(places, (place) => place.nome), [
    'Café de exemplo', 'Pizzaria de exemplo',
    'Restaurante de exemplo', 'Sushi de exemplo',
  ]);
  assert.equal(places.length, 4);
});

test('public date configuration has no recipient contacts', () => {
  assert.equal(config.EMAIL, '');
  assert.equal(config.WHATSAPP, '');
});