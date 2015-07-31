/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//Uses
import { TestFixture } from 'Cake/TestSuite/Fixture/TestFixture';

export class CustomersFixture extends TestFixture
{
	connection = 'test';
	
	fields = {
		id: 'integer',
		name: {type: 'string', null: false},
		phone: 'string',
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

