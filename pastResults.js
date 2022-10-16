const modalWrapper = document.querySelector('.modal-wrapper');
// modal add
const addModal = document.querySelector('.add-modal');
const addModalForm = document.querySelector('.add-modal .form');

// modal edit
const editModal = document.querySelector('.edit-modal');
const editModalForm = document.querySelector('.edit-modal .form');

const btnAdd = document.querySelector('.btn-add');

const tableUsers = document.querySelector('.table-users');

let id;

// Create element and render users
const renderUser = doc => {
  const tr = `
    <tr data-id='${doc.id}'>
      <td>${doc.data().Proposal}</td>
      <td>${doc.data().VotesFor}</td>
      <td>${doc.data().VotesAgainst}</td>
      <td>${doc.data().TotalVotes}</td>
      <td>${doc.data().Outcome}</td>
  
      <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
      </td>
    </tr>
  `;
  tableUsers.insertAdjacentHTML('beforeend', tr);

  // Click edit user
  const btnEdit = document.querySelector(`[data-id='${doc.id}'] .btn-edit`);
  btnEdit.addEventListener('click', () => {
    editModal.classList.add('modal-show');

    id = doc.id;
    editModalForm.Proposal.value = doc.data().Proposal;
    editModalForm.VotesFor.value = doc.data().VotesFor;
    editModalForm.VotesAgainst.value = doc.data().VotesAgainst;
    editModalForm.TotalVotes.value = doc.data().TotalVotes;
    editModalForm.Outcome.value = doc.data().Outcome;

  });

  const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
  btnDelete.addEventListener('click', () => {
    db.collection('pastResult').doc(`${doc.id}`).delete().then(() => {
      console.log('Document succesfully deleted!');
    }).catch(err => {
      console.log('Error removing document', err);
    });
  });

}

btnAdd.addEventListener('click', () => {
  addModal.classList.add('modal-show');

  addModalForm.Proposal.value = '';
  addModalForm.VotesFor.value = '';
  addModalForm.VotesAgainst.value = '';
  addModalForm.TotalVotes.value = '';
  addModalForm.Outcome.value = '';
});

window.addEventListener('click', e => {
  if(e.target === addModal) {
    addModal.classList.remove('modal-show');
  }
  if(e.target === editModal) {
    editModal.classList.remove('modal-show');
  }
});

db.collection('pastResult').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added') {
      renderUser(change.doc);
    }
    if(change.type === 'removed') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
    if(change.type === 'modified') {
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
      renderUser(change.doc);
    }
  })
})

// Click submit in add modal
addModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('pastResult').add({
    Proposal: addModalForm.Proposal.value,
    VotesFor: addModalForm.VotesFor.value,
    VotesAgainst: addModalForm.VotesAgainst.value,
    TotalVotes: addModalForm.TotalVotes.value,
    Outcome: addModalForm.Outcome.value,
  });
  modalWrapper.classList.remove('modal-show');
});

// Click submit in edit modal
editModalForm.addEventListener('submit', e => {
  e.preventDefault();
  db.collection('pastResult').doc(id).update({
    Proposal: editModalForm.Proposal.value,
    VotesFor: editModalForm.VotesFor.value,
    VotesAgainst: editModalForm.VotesAgainst.value,
    TotalVotes: editModalForm.TotalVotes.value,
    Outcome: editModalForm.Outcome.value,
  });
  editModal.classList.remove('modal-show');
  
});