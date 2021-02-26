const fs = require('fs');
const merge = require('deepmerge');
const activemodel = require('../src/activemodel.json');
const activerecord = require('../src/activerecord.json');
const activesupport = require('../src/activesupport.json');
const merged = merge.all([activemodel, activerecord, activesupport]);

fs.writeFileSync('./src/bundle.json', JSON.stringify(merged, null, 2));
