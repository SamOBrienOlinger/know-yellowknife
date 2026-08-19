import test from'node:test';import assert from'node:assert/strict';import{questions}from'../assets/data/questions.js';import{shuffle,selectQuestions,validateQuestions,nextHighScore}from'../assets/js/quiz-engine.js';
test('question bank has at least 20 approved questions',()=>assert.ok(questions.filter(q=>q.status==='approved').length>=20));
test('question records pass schema validation',()=>assert.deepEqual(validateQuestions(questions),[]));
test('selectQuestions returns ten unique questions without mutating source',()=>{const original=questions.map(q=>q.id);const selected=selectQuestions(questions,10,()=>.42);assert.equal(selected.length,10);assert.equal(new Set(selected.map(q=>q.id)).size,10);assert.deepEqual(questions.map(q=>q.id),original)});
test('selection rejects an insufficient approved pool',()=>assert.throws(()=>selectQuestions([{status:'draft'}],1),/At least 1 approved/));
test('shuffle returns a copy',()=>{const input=[1,2,3];const output=shuffle(input,()=>.5);assert.notEqual(input,output);assert.deepEqual([...output].sort(),input)});
test('best score only increases',()=>{assert.equal(nextHighScore(7,5),7);assert.equal(nextHighScore(7,9),9);assert.equal(nextHighScore(Number.NaN,4),4)});
