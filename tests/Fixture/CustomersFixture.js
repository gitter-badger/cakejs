/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Uses
var TestFixture = CakeJS.TestSuite.Fixture.TestFixture;

export class CustomersFixture extends TestFixture
{
	connection = 'test';
	
	fields = {
		id: {type: 'integer'},
		name: {type: 'string', length: 255, null: false},
		phone: { type: 'string', length: 60 },
		_constraints: {
			primary: { type: 'primary', columns: ['id'] }
		}
	};

	records = [
		{
			name: 'John Doe',
			phone: '010-12345'
		},
		{
			name: 'Jane Doe',
			phone: '020-23456'
		}
	];
}

