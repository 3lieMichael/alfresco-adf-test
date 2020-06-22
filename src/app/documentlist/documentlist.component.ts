import { Component, ViewChild, Input } from '@angular/core';
import { NotificationService, SearchService, ObjectDataTableAdapter } from '@alfresco/adf-core';
import { DocumentListComponent, ContentNodeDialogService } from '@alfresco/adf-content-services';
import { PreviewService } from '../services/preview.service';
import { ResultSetPaging, ResultNode, ResultSetRowEntry } from '@alfresco/js-api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.css']
})
export class DocumentlistComponent {

  @Input()
  showViewer = false;
  nodeId: string = null;

  @ViewChild('documentList')
  documentList: DocumentListComponent;

  data: ObjectDataTableAdapter;
  schema: any;

  constructor(
    private notificationService: NotificationService,
    private preview: PreviewService, 
    private searchService: SearchService,
    private contentDialogService: ContentNodeDialogService ) {
  }

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  showPreview(event) {
    this.previewFile(event.value.entry);
  }

  onGoBack(event: any) {
    this.showViewer = false;
    this.nodeId = null;
  }

  myCustomActionAfterDelete(event) {
    let entry = event.value.entry;
    let item = '';

    if (entry.isFile) {
      item = 'file';
    } else if (entry.isFolder) {
      item = 'folder';
    }

    this.notificationService.openSnackMessage(`Deleted ${item} "${entry.name}" `, 5000);
  }

  onItemClicked(event) {
    this.previewFile(event.entry);
  }

  previewFile(entry){
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onSearchChanged(event: string) {
    this.searchService.search(event, 10, 0).pipe(
      map(x => {
        let res = [];
        x.list.entries.forEach(e => res.push(e.entry));
        return res;
      })

    ).subscribe((x) => {
      this.data = new ObjectDataTableAdapter(x, [
          {
              type: 'text',
              key: 'name',
              title: 'Name',
              sortable: true
          },
          {
              type: 'text',
              key: 'createdByUser.displayName',
              title: 'Created by'
          },
          {
              type: 'text',
              key: 'path.name',
              title: 'Path'
          }
      ]);
      console.log(this.data);
    });
  }

  onMove(event){
    console.warn(event);
    this.contentDialogServicek
            .openCopyMoveDialog("copy", this.documentList.currentFolderId, "copy")
            .subscribe((selections: MinimalNode[]) => {
                // place your action here on operation success!
                console.warn("Move success");
            });
  }

}


